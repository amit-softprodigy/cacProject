import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  DropdownDown,
  DropdownUp,
  LogoBG,
  CloseIcon,
} from '../../../Utils/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Login, Logout } from '../../../Redux/Actions/login_action';
import { useNavigation, useRoute } from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-modal';
import { strings } from '../../../strings';
import stripe from 'tipsi-stripe';
import Toast from 'react-native-simple-toast';
import * as Storage from '../../../service/AsyncStoreConfig';
import {
  getWeeklyPayments,
  weeklyCashPayment,
  weeklyCardPayment,
  weeklyMobileApi,
  weeklyOrangeApi,
  orangeStatusApi
} from '../../../service/Api';
var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let interval;
const CacPayment = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setdata] = useState([]);
  const [isModalVisible, setModelVisibile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobileMoneyOrOrangeMoneyModal, setMobileMoneyOrOrangeModal] = useState(false);
  const [phoneNumber, setphoneNumber] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [moneyType, setMoneyType] = useState('');
  const [orangeStatusModal,setOrangeStatusModalVisibility] = useState(false);

  React.useEffect(() => {
    getWeeklyData();
    //setData()
    Storage.getData('UserObject').then((res) => {
      setphoneNumber(JSON.parse(res).phone_number);
    });
    return () => clearInterval(interval);
  }, []);
  async function mobileMoneyApi() {
    if (phoneNumber.trim() == '') Toast.show(strings.VALID_MOBILE);
    else {
      setMobileMoneyOrOrangeModal(false);
      setLoading(true);
      var bodyFormData = new FormData();
      bodyFormData.append('week', selectedWeek);
      await weeklyMobileApi(bodyFormData, phoneNumber)
        .then(async (response) => {
          console.log('response getttingg=====', response)
          setLoading(false);
          if (response.status == 200) {
            Toast.show(response.data.message);
            getWeeklyData();
          } else {
            Toast.show(response.data.errors);
          }
        })
        .catch((error) => {
          console.log('send payment id status' + JSON.stringify(error));
          setLoading(false);
          // Toast.show(errors)
        });
    }
  }

  const orangeMoneyApi = async () => {
    if (phoneNumber.trim() == '') Toast.show(strings.VALID_MOBILE);
    else {
      setMobileMoneyOrOrangeModal(false);
      setLoading(true);
      var bodyFormData = new FormData();
      bodyFormData.append('week', selectedWeek);
      await weeklyOrangeApi(bodyFormData, phoneNumber)
        .then(async (response) => {
          setLoading(false);

          if (response.status == 200) {
            setOrangeStatusModalVisibility(true);
            interval = setInterval(() => {
              getOrangeMoneyStatusApi(response.data.token);
            }, 5000);
            Toast.show(response.data.message);
            getWeeklyData();
          } else {
            Toast.show(response.data.errors);
          }
        })
        .catch((error) => {
          console.log('send payment id status' + JSON.stringify(error));
          setLoading(false);
          // Toast.show(errors)
        });
    }
  }


  const getOrangeMoneyStatusApi = async (formToken) => {
    if(formToken) {
      setLoading(true);
      var bodyFormData = new FormData();
      bodyFormData.append('token', formToken);
      await orangeStatusApi(bodyFormData)
        .then(async (response) => {
          console.log('response status api getttingg=====', response);
          setLoading(false);
          if (response.status == 200) {
            if(response.data.transaction_status === 'Transaction validation pending') {
              Toast.show(response.data.transaction_status);
              getWeeklyData();
            }

            else {

              getWeeklyData();
              
              setOrangeStatusModalVisibility(false)
              Toast.show(response.data.transaction_status, Toast.LONG);
            }
            
          
          } else {
            Toast.show(response.data.errors);
          }
        })
        .catch((error) => {
          console.log('send payment id status' + JSON.stringify(error));
          setLoading(false);
          // Toast.show(errors)
        });
      }
  }

  async function showCardForm() {
    setModelVisibile(false);
    const token = await stripe.paymentRequestWithCardForm();
    console.log(token);
    sendWeeklyPaymentId(token.tokenId);
  }
  async function getWeeklyData() {
    setLoading(true);
    
    await getWeeklyPayments()
      .then(async (response) => {
        setLoading(false);
        
        if (response.status == 200) {
          let weeklyData = response.data;
          setdata(weeklyData);
          console.log(weeklyData);
        } else {
          Toast.show(response.data.errors);
        }
      })
      .catch((error) => {
        console.log('weekly token status' + JSON.stringify(error));
        setLoading(false);
      });
  }

  function showPaymentDialog(item) {
    setSelectedWeek(item.week);
    if (!item.paid) setModelVisibile(true);
  }
  async function generateWeeklyCashToken() {
    setModelVisibile(false);
    setLoading(true);
    var bodyFormData = new FormData();
    bodyFormData.append('week', selectedWeek);
    await weeklyCashPayment(bodyFormData)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200) {
          alert(strings.TOKEN_PLACEHOLDER + response.data.token);
          getWeeklyData();
        } else {
          Toast.show(response.data.errors);
        }
      })
      .catch((error) => {
        console.log('access cash Status' + JSON.stringify(error));
        setLoading(false);
        // Toast.show(errors)
      });
  }
  async function sendWeeklyPaymentId(id) {
    setLoading(true);
    var bodyFormData = new FormData();
    bodyFormData.append('payment_method_id', id);
    bodyFormData.append('week', selectedWeek);
    await weeklyCardPayment(bodyFormData)
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200) {
          Toast.show(response.data.message);
          getWeeklyData();
        } else {
          Toast.show(response.data.errors);
        }
      })
      .catch((error) => {
        console.log('weekly token status' + JSON.stringify(error));
        setLoading(false);
        // Toast.show(errors)
      });
  }

  if(!orangeStatusModal) {
    console.log('interval geettingg====', interval)
    clearInterval(interval)
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ImageBackground
        source={LogoBG}
        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="gray" />
          </View>
        ) : null}
        <View
          style={{
            height: hp('8%'),
            width: '100%',
            backgroundColor: '#FFF',
            flexDirection: 'row',
            elevation: 10,
            shadowOffset: { height: 0, width: 1 },
            shadowColor: 'grey',
            shadowOpacity: 2,
            alignItems: 'center',
            zIndex: 1,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack(null)}
            style={{ width: '20%' }}>
            <Image
              style={{
                height: '40%',
                width: '40%',
                resizeMode: 'contain',
                alignSelf: 'center',
                padding: 10,
              }}
              source={CloseIcon}
            />
          </TouchableOpacity>
          <Text
            style={{
              width: '70%',
              fontSize: hp('2.5%'),
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {strings.CAC_WEEK_PAYMENTS}
          </Text>
        </View>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          extraData={data}
          keyExtractor={(item, index) => index.toString()}
          //ItemSeparatorComponent={this.renderSeparator}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '90%',
                alignSelf: 'center',
                borderRadius: 10,
                borderWidth: 3,
                borderColor: '#F5F5F5',
                padding: hp('1%'),
                marginVertical: hp('1%'),
                backgroundColor: index % 2 == 0 ? '#F5F5F5' : '#FFF',
              }}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  fontWeight: 'bold',
                  width: wp('30%'),
                }}>
                {item.week}
              </Text>
              <Text
                style={{
                  fontSize: hp('2%'),
                  color: '#019139',
                  fontWeight: 'bold',
                }}>
                {item.plan_price}
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    showPaymentDialog(item);
                  }}
                  disabled={item.paid}
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: item.paid ? '#019139' : 'red',
                    backgroundColor: item.paid ? '#019139' : 'red',
                    paddingHorizontal: wp('4%'),
                    paddingVertical: hp('0.5%'),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: item.status == 'Paid' ? '#019139' : '#FFF',
                      fontWeight: 'bold',
                    }}>
                    {item.paid ? strings.PAID : strings.PAY}
                  </Text>
                </TouchableOpacity>
                {item.token == '' ? null : item.paid ? null : (
                  <Text
                    onPress={() => {
                      alert(
                        'rendez-vous dans une agence express union ou nofia munie de ce code pour realiser le paiement : ' +
                        item.token,
                      );
                    }}
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: hp(1.5),
                      marginTop: hp(1.2),
                      textAlign: 'center',
                    }}>
                    Show Token
                  </Text>
                )}
              </View>
            </View>
          )}
        />
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModelVisibile(false)}
          onBackButtonPress={() => setModelVisibile(false)}
          onModalHide={() => setModelVisibile(false)}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View
              style={{
                backgroundColor: '#F3F3F3',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ paddingVertical: 12, fontWeight: 'bold' }}>
                {strings.PAYMENT_METHODS}
              </Text>
              <View
                style={{
                  backgroundColor: '#D4D4D4',
                  width: '100%',
                  height: 1,
                }}
              />

              <Text
                style={{
                  width: '100%',
                  paddingVertical: 12,
                  textAlign: 'center',
                }}
                onPress={() => showCardForm()}>
                {strings.CREDIT_AND_DEBIT}
              </Text>
              <View
                style={{
                  backgroundColor: '#D4D4D4',
                  width: '100%',
                  height: 1,
                }}
              />

              <Text
                style={{
                  width: '100%',
                  paddingVertical: 12,
                  textAlign: 'center',
                }}
                onPress={() => {
                  setMoneyType('mobile')
                  setModelVisibile(false);
                  setTimeout(() => {
                    setMobileMoneyOrOrangeModal(true);
                  }, 500)

                }}>
                {strings.MOBILE_MONEY}
              </Text>

              <View
                style={{
                  backgroundColor: '#D4D4D4',
                  width: '100%',
                  height: 1,
                }}
              />

              <Text
                style={{
                  width: '100%',
                  paddingVertical: 12,
                  textAlign: 'center',
                }}
                onPress={() => {
                  setMoneyType('orange')
                  setModelVisibile(false);
                  setTimeout(() => {
                    setMobileMoneyOrOrangeModal(true);
                  }, 500)

                }}>
                {strings.ORANGE_MONEY}
              </Text>

              <View
                style={{
                  backgroundColor: '#D4D4D4',
                  width: '100%',
                  height: 1,
                }}
              />

              <TouchableOpacity style={styles.btnCancel}>
                <Text
                  onPress={() => generateWeeklyCashToken()}
                  style={{
                    width: '100%',
                    paddingVertical: 12,
                    textAlign: 'center',
                  }}>
                  {strings.CASH}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={showMobileMoneyOrOrangeMoneyModal}
          onBackdropPress={() => setMobileMoneyOrOrangeModal(false)}
          onBackButtonPress={() => setMobileMoneyOrOrangeModal(false)}
          onModalHide={() => setMobileMoneyOrOrangeModal(false)}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View
              style={{
                height: hp(25),
                backgroundColor: '#F3F3F3',
                borderRadius: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setMobileMoneyOrOrangeModal(false)}
                style={{
                  width: '15%',
                  height: '15%',
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  marginTop: hp(1),
                }}>
                <Image
                  style={{
                    height: '60%',
                    width: '60%',
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={CloseIcon}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  color: 'gray',
                  marginBottom: hp(2),
                }}>
                {moneyType == 'mobile' ? strings.ENTER_MOBILE_MONEY : strings.ENTER_ORANGE_MONEY}
              </Text>
              <TextInput
                placeholderTextColor={'#808E95'}
                style={{
                  height: hp(5),
                  width: wp(38),
                  fontSize: hp('1.6%'),
                  textAlign: 'auto',
                  borderWidth: 0.5,
                  marginBottom: hp(2),
                  paddingHorizontal: hp(2),
                }}
                onSubmitEditing={() => {
                  if (moneyType == 'mobile') {
                    mobileMoneyApi();
                  }
                  else {
                    orangeMoneyApi();
                  }
                }}
                autoFocus={true}
                keyboardType="numeric"
                onChangeText={(phoneNumber) => {
                  setphoneNumber(phoneNumber);
                }}
                value={phoneNumber}
                maxLength={15}
              // keyboardType={"decimal-pad"}
              />
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  borderRadius: 8,
                  width: '50%',
                  height: hp('6%'),
                  backgroundColor: '#019139',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('2%'),
                }}
                onPress={() => {
                  if (moneyType == 'mobile') {
                    mobileMoneyApi();
                  }
                  else {
                    orangeMoneyApi();
                  }
                }}>
                <Text style={{ color: '#FFF', fontSize: hp('2.2%') }}>
                  {strings.CONFIRM}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



        <Modal
          isVisible={orangeStatusModal}
          onBackdropPress={() => setOrangeStatusModalVisibility(false)}
          onBackButtonPress={() => setOrangeStatusModalVisibility(false)}
          onModalHide={() => setOrangeStatusModalVisibility(false)}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View
              style={{
                height: hp(25),
                backgroundColor: '#F3F3F3',
                borderRadius: 20,
              }}>
              <TouchableOpacity
                onPress={() => setOrangeStatusModalVisibility(false)}
                style={{
                  width: '15%',
                  height: '15%',
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  marginTop: hp(1),
                  // backgroundColor: 'red'
                }}>
                <Image  
                  style={{
                    height: '60%',
                    width: '60%',
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={CloseIcon}
                />
              </TouchableOpacity>
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                paddingBottom: 20,
                // backgroundColor: 'green'
              }}>
                <Text style={{
                  fontSize: 20,
                  color: 'black',
                  textAlign: 'center'
                }}>Please authorize the payment on your phone to complete the transaction</Text>
              </View>
            </View>
          </View>
        </Modal>





      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = {
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
};

function mapStateToProps(state) {
  const { hideProgress } = state.loginReducer;
  return { hideProgress };
}

export default connect(mapStateToProps, {})(CacPayment);
