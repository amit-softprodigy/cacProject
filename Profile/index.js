import React, {Component, useState, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  NativeModules,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {
  person,
  CloseIcon,
  logo,
  DropdownDown,
  DropdownUp,
} from '../../../Utils/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  refreshAction,
  Logout,
  updateDrawer,
  updateDrawerUrl,
} from '../../../Redux/Actions/login_action';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as Storage from '../../..//service/AsyncStoreConfig';
//import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-date-picker'
import Modal from 'react-native-modal';
var ImagePicker = NativeModules.ImageCropPicker;
import Toast from 'react-native-simple-toast';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  getProfileApi,
  updateProfileApi,
  updateAvatar,
} from '../../../service/Api';
import {strings} from '../../../strings';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

const Profile = (props) => {
  let languages = [{value: 'English'}, {value: 'French'}];
  let PaymentTypes = [
    {value: 'Credit cards'},
    {value: 'Mobile money'},
    {value: 'Cash'},
  ];
  let MartialStatus = [{value: 'single'}, {value: 'married'}];
  let Amount = [
    {value: '0'},
    {value: '1'},
    {value: '2'},
    {value: '3'},
    {value: '4'},
    {value: '5'},
    {value: '6'},
    {value: '7'},
    {value: '8'},
    {value: '9'},
    {value: '10'},
  ];

  const navigation = useNavigation();

  const fName = useRef();
  const Lname = useRef();
  const googlePlaceInputText = useRef();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUri, setImage] = useState('');
  const [email, setEmail] = useState('john.deo@xyz.com');
  const [password, setPassword] = useState('11111111');
  const [language, setlanguage] = useState('');
  const [languageEnable, setlanguageEnable] = useState(false);
  const [payment, setPayment] = useState('Credit cards');
  const [paymentEnable, setPaymentEnable] = useState(false);
  const [cardNumber, setcardNumber] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [cardDate, setcardDate] = useState('');
  const [city, setcity] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [maritalEnable, setMaritalEnable] = useState(false);
  const [marriageNumber, setMarriageNumber] = useState('');
  const [children, setchildren] = useState('');
  const [childrenEnable, setChildrenEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [refreshView, setRefreshView] = useState(false);
  const [isModalVisible, setModelVisibile] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageData, setImageData] = useState(null);
  const [date, setDate] = useState(new Date())
  const [showPicker,setShowPicker]=useState(false)

  React.useEffect(() => {
    //console.log(route.name)

    const getProfileApiHit = async () => {
      setLoading(true);
      await getProfileApi()
        .then((response) => {
          console.log('Profile Success  ' + JSON.stringify(response));
          setLoading(false);
          if (response.status == 200) {
            setData(response.data.user);
            setDefaultLanguage();
          } else {
            Toast.show(response.data.errors);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log('Change Password  ' + JSON.stringify(error));
          // Toast.show(errors)
        });
    };

    getProfileApiHit();
    //console.log("url---"+props.drawerUrl)
  }, []);

  function showModal() {
    setModelVisibile(true);
  }
  const setData = (data) => {
    setFirstName(data.first_name);
    setLastName(data.last_name);
    setImage(data.avatar);
    setEmail(data.email);
    setcardNumber(data.id_card);
    setphoneNumber(data.phone_number);
    var dateID = data.id_card_delivery_date;
    var id_date = dateID.split('-').reverse().join('/');
    setcardDate(id_date);
    googlePlaceInputText.current.setAddressText(data.city);
    setcity(data.city);
    setMaritalStatus(data.marital_status);
    setchildren(data.children_number.toString());
  };
  async function saveLanguageLocally() {
    if (languageIndex == 0) {
      await Storage.saveLanguage('english');
      strings.setLanguage('en');
      //this is to re -render this component after lang is changed
      setRefreshView(!refreshView);
      //this to re render home screen after lang changed
      props.refreshAction();
    } else {
      await Storage.saveLanguage('french');
      strings.setLanguage('fr');
      setRefreshView(!refreshView);
      props.refreshAction();
    }
  }
  async function setDefaultLanguage() {
    const lang = await Storage.getLanguage();
    if (lang == 'english') setlanguage('English');
    else setlanguage('French');
  }
  function pickSingleWithCamera(cropping, mediaType = 'photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      includeBase64: false,
      compressImageQuality: 0.5,
      mediaType,
    })
      .then((image) => {
        // console.log("1-" + JSON.stringify(image))
        setImageData(image);
        let name = 'images-' + Date.now().toString() + '.jpg';
        setImageName(name);
        setModelVisibile(false);
        setTimeout(() => {
          uploadAvatarApi(name, image);
        }, 500);
      })
      .catch((e) => console.log(e));
  }
  function pickSingle(cropit, mediaType = 'photo') {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: false,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      mediaType,
      includeBase64: false,
      compressImageQuality: 0.5,
      multiple: false,
    })
      .then((image) => {
        // console.log("2-" + JSON.stringify(image))
        setImageData(image);
        let name = 'images-' + Date.now().toString() + '.jpg';
        setImageName(name);
        setModelVisibile(false);
        setTimeout(() => {
          uploadAvatarApi(name, image);
        }, 500);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function uploadAvatarApi(name, image) {
    let imageRequest = {
      imageData: image,
      imageName: name,
    };
    setLoading(true);
    await updateAvatar(imageRequest)
      .then(async (response) => {
        console.log('Image Success  ' + JSON.stringify(response));
        setLoading(false);
        if (!('errors' in response.data)) {
          Toast.show(response.data.message);
          await Storage.saveData('avatar_url', response.data.user.avatar);
          setImage(response.data.user.avatar);
          props.updateDrawerUrl(response.data.user.avatar);
        } else {
          Toast.show(response.data.errors);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Add Project  ' + JSON.stringify(error));
        // Toast.show(errors)
      });
  }

  const LanguageLayout = languages.map((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setLanguageIndex(index),
            setlanguage(item.value),
            setlanguageEnable(false);
        }}
        style={{
          width: '100%',
          height: hp('5%'),
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: index == languages.length - 1 ? 0 : 0.5,
          borderBottomColor: 'grey',
        }}>
        <Text style={{fontSize: hp('2%')}}>{item.value}</Text>
      </TouchableOpacity>
    );
  });
  const PaymentLayout = PaymentTypes.map((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setPayment(item.value), setPaymentEnable(false);
        }}
        style={{
          width: '100%',
          height: hp('5%'),
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: index == PaymentTypes.length - 1 ? 0 : 0.5,
          borderBottomColor: 'grey',
        }}>
        <Text style={{fontSize: hp('2%')}}>{item.value}</Text>
      </TouchableOpacity>
    );
  });
  const MaritalStatusLayout = MartialStatus.map((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setMaritalStatus(item.value), setMaritalEnable(false);
        }}
        style={{
          width: '100%',
          height: hp('5%'),
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: index == MartialStatus.length - 1 ? 0 : 0.5,
          borderBottomColor: 'grey',
        }}>
        <Text style={{fontSize: hp('2%')}}>{item.value}</Text>
      </TouchableOpacity>
    );
  });
  const ChildrenLayout = Amount.map((item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setchildren(item.value), setChildrenEnable(false);
        }}
        style={{
          width: '100%',
          height: hp('5%'),
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: index == Amount.length - 1 ? 0 : 0.5,
          borderBottomColor: 'grey',
        }}>
        <Text style={{fontSize: hp('2%')}}>{item.value}</Text>
      </TouchableOpacity>
    );
  });

  updateProfile = () => {
    // console.log(firstName.trim()+"=="+lastName.trim()+"=="+cardNumber.trim()+"=="+cardDate.trim()+"=="+city.trim()+"=="+maritalStatus.trim()+"=="+marriageNumber.trim()+"=="+children.trim()+"=="+phoneNumber.trim())
    if (
      firstName.trim() == '' ||
      lastName.trim() == '' ||
      cardNumber.trim() == '' ||
      cardDate.trim() == '' ||
      city.trim() == '' ||
      maritalStatus.trim() == '' ||
      children.trim() == '' ||
      phoneNumber.trim() == ''
    ) {
      Toast.show(strings.ALL_FIELDS_MANDATORY);
    }
    // else if (phoneNumber.trim().length<10) {
    //   Toast.show("Please enter a valid Mobile Number")
    // }
    else if (cardNumber.trim().length < 12) {
      Toast.show(strings.PLEASE_ENTER_VALID_CARD);
    } else if (city.trim().length < 2) {
      Toast.show(strings.PLEASE_ENTER_VALID_CITY);
    } else {
      updateProfileApiHit();
    }
  };
  const updateProfileApiHit = async () => {
    setLoading(true);
    var bodyFormData = new FormData();
    // bodyFormData.append('dob', '')
    bodyFormData.append('first_name', firstName);
    bodyFormData.append('last_name', lastName);
    bodyFormData.append('id_card', cardNumber);
    bodyFormData.append('phone_number', phoneNumber);
    var dateID = cardDate;
    //var id_date = dateID.split('/').reverse().join('-');
    var id_date = dateID
    bodyFormData.append('id_card_delivery_date', id_date);
    bodyFormData.append('city', city);
    bodyFormData.append('marital_status', maritalStatus);
    //  bodyFormData.append('marriage_number', marriageNumber)
    bodyFormData.append('children_number', children);
    await updateProfileApi(bodyFormData)
      .then((response) => {
        console.log('Update Profile Success  ' + JSON.stringify(response));
        setLoading(false);
        if (response.status == 200) {
          Toast.show(response.data.message);
          saveLanguageLocally();
          props.updateDrawer(
            response.data.user.first_name + ' ' + response.data.user.last_name,
          );
          Storage.saveData('UserObject', JSON.stringify(response.data.user));
          navigation.goBack(null)
        } else {
          Toast.show(response.data.errors);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Change Password  ' + JSON.stringify(error));
        // Toast.show(errors)
      });
  };
  console.log('image>>', imageUri);
  function setSelectedDate(date){
    setDate(date)
    let selecteddate=JSON.stringify(date)
    setcardDate(selecteddate.substr(1,10))
  }
  return (
    // <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}
    //  keyboardShouldPersistTaps='handled'
    //   style={{ flex: 1, height: '100%', backgroundColor: '#FFFFFF' }} >
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <KeyboardAwareScrollView
        style={{backgroundColor: 'white'}}
        resetScrollToCoords={{x: 0, y: 0}}
        keyboardShouldPersistTaps={'handled'}
        enableOnAndroid={true}
        contentContainerStyle={styles.container}>
        <View
          style={{
            height: '5%',
            width: '100%',
            backgroundColor: '#FFF',
            flexDirection: 'row',
            elevation: 10,
            shadowOffset: {height: 0, width: 1},
            shadowColor: 'grey',
            shadowOpacity: 2,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack(null)}
            style={{width: '20%'}}>
            <Image
              style={{
                padding: 10,
                width: '40%',
                resizeMode: 'contain',
                alignSelf: 'center',
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
            {strings.EDIT_PROFILE}
          </Text>
        </View>

        <View
          contentContainerStyle={{height: '100%', width: '100%'}}
          style={{height: '100%', width: '96%', alignSelf: 'center'}}>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="gray" />
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              showModal();
            }}
            style={{
              height: hp('10%'),
              width: hp('10%'),
              borderRadius: hp('5%'),
              backgroundColor: '#FFF',
              justifyContent: 'center',
              alignSelf: 'center',
              marginVertical: hp('5%'),
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.5,
            }}>
            <Image
              style={{
                height: hp('10%'),
                width: hp('10%'),
                borderRadius: hp('5%'),
                // resizeMode: 'stretch',
                alignSelf: 'center',
              }}
              source={imageUri == '' ? person : {uri: imageUri}}
            />
          </TouchableOpacity>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '45%'}}>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'gray',
                    marginBottom: hp('1%'),
                  }}>
                  {strings.FIRST_NAME}
                </Text>
                <TextInput
                   placeholderTextColor={'#808E95'}
                  ref={fName}
                  style={styles.textInput}
                  onSubmitEditing={() => {
                    Lname.current.focus();
                  }}
                  placeholder={strings.ENTER_YOUR_FIRST_NAME}
                  onChangeText={(text) => {
                    firstName.length == 0
                      ? setFirstName(text.replace(/[^A-Za-z]/gi, ''))
                      : setFirstName(text.replace(/[^A-Za-z 0-9 '‘’]/g, ''));
                  }}
                  value={firstName}
                  maxLength={20}
                />
              </View>

              <View style={{width: '45%'}}>
                <Text
                  style={{
                    fontSize: hp('1.8%'),
                    color: 'gray',
                    marginBottom: hp('1%'),
                  }}>
                  {strings.LAST_NAME}
                </Text>
                <TextInput
                  ref={Lname}
                  placeholderTextColor={'#808E95'}
                  style={styles.textInput}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={strings.ENTER_YOUR_LAST_NAME}
                  onChangeText={(text) => {
                    lastName.length == 0
                      ? setLastName(text.replace(/[^A-Za-z]/gi, ''))
                      : setLastName(text.replace(/[^A-Za-z 0-9 '‘’]/g, ''));
                  }}
                  value={lastName}
                  maxLength={20}
                />
              </View>
            </View>
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginTop: hp('2%'),
                marginBottom: hp('1%'),
              }}>
              {strings.EMAIL_ID}
            </Text>
            <TextInput
               placeholderTextColor={'#808E95'}
              // ref={Email}
              editable={false}
              style={[styles.textInput, {borderWidth: 0, color: 'gray'}]}
              // onSubmitEditing={()=>Password.current.focus()}
              placeholder={''}
              onChangeText={(email) => {
                setEmail(email);
              }}
              value={email}
              maxLength={45}
            />

            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginTop: hp('2%'),
                marginBottom: hp('1%'),
              }}>
              {strings.PASSWORD}
            </Text>
            <View
              style={{
                height: hp('5%'),
                marginBottom: hp('2%'),
                flexDirection: 'row',
                borderWidth: 0,
                borderColor: '#cccccc',
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextInput
                // ref={Password}
                editable={false}
                placeholderTextColor={'#808E95'}
                style={{
                  fontSize: hp('1.6%'),
                  paddingHorizontal: hp('2%'),
                  width: '65%',
                  color: 'gray',
                }}
                // onSubmitEditing={()=>CPassword.current.focus()}
                placeholder={'******'}
                secureTextEntry={true}
                onChangeText={(password) => {
                  setPassword(password);
                }}
                value={password}
                maxLength={20}
              />
              <Text
                onPress={() => {
                  navigation.navigate('ChangePassword');
                }}
                style={{fontSize: hp('1.8%'), color: '#019139'}}>
                {strings.CHANGE_PASSWORD}
              </Text>
            </View>
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginBottom: hp('1%'),
              }}>
              {strings.PHONE_NUMBER}*
            </Text>
            <TextInput
              //   ref={cName}
              style={styles.textInput}
              placeholderTextColor={'#808E95'}
              onSubmitEditing={() => Keyboard.dismiss()}
              keyboardType="numeric"
              placeholder={strings.ENTER_PHONE_NUMBER}
              onChangeText={(phoneNumber) => {
                setphoneNumber(phoneNumber);
              }}
              value={phoneNumber}
              maxLength={15}
              // keyboardType={"decimal-pad"}
            />
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginBottom: hp('1%'),
                marginTop: hp('2%'),
              }}>
              {strings.CHOOSE_LANGUAGE}
            </Text>
            <TouchableOpacity
              onPress={() => setlanguageEnable(!languageEnable)}>
              <View
                style={{
                  marginBottom: hp('2%'),
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 4,
                  alignItems: 'center',
                }}>
                <TextInput
                   placeholderTextColor={'#808E95'}
                  style={{
                    fontSize: hp('1.6%'),
                    height: hp('5%'),
                    paddingHorizontal: hp('2%'),
                    width: '90%',
                  }}
                  maxLength={45}
                  editable={false}
                  placeholder={strings.CHOOSE_LANGUAGE}
                  value={language}
                  //maxLength={max}
                  //keyboardType={KeyboardType}
                  //autoCapitalize={capital}
                />
                <Image
                  style={{
                    height: hp('4%'),
                    width: hp('4%'),
                    resizeMode: 'contain',
                  }}
                  source={languageEnable ? DropdownUp : DropdownDown}
                />
              </View>
            </TouchableOpacity>
            {languageEnable && (
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{
                  width: '100%',
                  backgroundColor: '#F2F2F2',
                  height: hp('10%'),
                  borderRadius: 10,
                }}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: hp('2%'),
                }}>
                {LanguageLayout}
              </ScrollView>
            )}
            {/* <Text style={{ fontSize: hp('1.8%'), color: 'gray', marginBottom: hp('1%') }}>{strings.PAYMENT_STATUS}</Text>
          <TouchableOpacity onPress={() => setPaymentEnable(!paymentEnable)}>
          <View style={{ marginBottom: hp('2%'), flexDirection: 'row', borderWidth: 1, borderColor: '#cccccc', borderRadius: 4, alignItems: 'center' }}>
            <TextInput
              style={{ fontSize:hp('1.6%'),height:hp("5%"),paddingHorizontal: hp('2%'), width: '90%' }}
              maxLength={45}
              editable={false}
              placeholder={strings.PAYMENT_STATUS}
              value={payment}
            //maxLength={max}
            //keyboardType={KeyboardType}
            //autoCapitalize={capital}
            />
              <Image style={{ height: hp('4%'), width: hp('4%'), resizeMode: 'contain' }} source={paymentEnable ? DropdownUp : DropdownDown} />
          </View>
          </TouchableOpacity> */}
            {paymentEnable && (
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{
                  width: '100%',
                  backgroundColor: '#F2F2F2',
                  height: hp('10%'),
                  borderRadius: 10,
                }}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: hp('2%'),
                }}>
                {PaymentLayout}
              </ScrollView>
            )}
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginBottom: hp('1%'),
              }}>
              {strings.ID_CARD_NUMBER}
            </Text>
            <TextInput
              //   ref={cName}
              placeholderTextColor={'#808E95'}
              style={styles.textInput}
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholder={strings.ENTER_ID_CARD_NUMBER}
              onChangeText={(cardNumber) => {
                setcardNumber(cardNumber);
              }}
              value={cardNumber}
              maxLength={12}
              // keyboardType={"decimal-pad"}
            />
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginBottom: hp('1%'),
                marginTop: hp('2%'),
              }}>
              {strings.ID_CARD_DELIVERY_DATE}
            </Text>
            {!showPicker && <TouchableOpacity  style={styles.datepicker} onPress={()=>{setShowPicker(true)}}>
             <Text style={{color:"#808E95"}}>{cardDate}</Text>
            </TouchableOpacity>}
           {showPicker && <DatePicker
              date={date}
              mode={"date"}
              onDateChange={(date) => {setSelectedDate(date)}}
            />}
            {/* <DatePicker
              style={{width: '100%'}}
              date={cardDate}
              mode="date"
              placeholder="DD / MM / YYYY"
              format="DD/MM/YYYY"
              minDate="01-01-2010"
              maxDate="01-01-2040"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateInput: [styles.textInput, {alignItems: 'flex-start'}],

                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => setcardDate(date)}
            /> */}
            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginBottom: hp('1%'),
                marginTop: hp('2%'),
              }}>
              {strings.CITY_STAR}
            </Text>
            <GooglePlacesAutocomplete
              ref={googlePlaceInputText}
              enablePoweredByContainer={false}
              placeholder={strings.SELECT_CITY}
              minLength={1}
              autoFocus={false}
              returnKeyType={'search'}
              listViewDisplayed={props.showPlacesList}
              keyboardShouldPersistTaps={'always'}
              fetchDetails={true}
              renderDescription={(row) => row.description}
              onPress={(data, details = null) => {
                console.log(data.terms[0].value);
                setcity(data.terms[0].value);
                // props.googlefuntion(data);
              }}
              getDefaultValue={() => {
                return '';
              }}
              query={{
                key: 'AIzaSyCU4YlcxKL5lleN5wKiRfLhoJPfGXOjTRs',
                language: 'En',
                types: '(cities)',
                origin: null,
              }}
              styles={{
                container: {
                  width: '104%',
                },
                description: {
                  fontWeight: 'bold',
                },
                textInputContainer: {
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                },
                textInput: [
                  styles.textInput,
                  {
                    bottom: hp('1%'),
                    right: hp('1%'),
                    width: '150%',
                  },
                ],
                predefinedPlacesDescription: {
                  color: '#1FAADB',
                },
              }}
              currentLocation={false}
            />

            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginBottom: hp('1%'),
                marginTop: hp('2%'),
              }}>
              {strings.MARTIAL_STATUS}
            </Text>
            <TouchableOpacity onPress={() => setMaritalEnable(!maritalEnable)}>
              <View
                style={{
                  marginBottom: hp('2%'),
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 4,
                  alignItems: 'center',
                }}>
                <TextInput
                   placeholderTextColor={'#808E95'}
                  style={{
                    fontSize: hp('1.6%'),
                    height: hp('5%'),
                    paddingHorizontal: hp('2%'),
                    width: '90%',
                  }}
                  maxLength={45}
                  editable={false}
                  placeholder={strings.MARTIAL_STATUS}
                  onChangeText={(txt) => setMaritalStatus(txt)}
                  value={maritalStatus}
                  //maxLength={max}
                  //keyboardType={KeyboardType}
                  //autoCapitalize={capital}
                />
                <Image
                  style={{
                    height: hp('4%'),
                    width: hp('4%'),
                    resizeMode: 'contain',
                  }}
                  source={maritalEnable ? DropdownUp : DropdownDown}
                />
              </View>
            </TouchableOpacity>
            {maritalEnable && (
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{
                  width: '100%',
                  backgroundColor: '#F2F2F2',
                  height: hp('12%'),
                  borderRadius: 10,
                }}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: hp('2%'),
                }}>
                {MaritalStatusLayout}
              </ScrollView>
            )}
            {/* <Text style={{fontSize:hp('1.8%'),color:'gray',marginBottom:hp('1%')}}>Marriage Number*</Text>
                <TextInput
                //   ref={mNumber}
                  style={styles.textInput}
                  onSubmitEditing={()=>Keyboard.dismiss()}
                  placeholder={'Marriage Number'}
                  onChangeText={(num)=>{setMarriageNumber(num)}}
                  value={marriageNumber}
                  maxLength={3}
                  keyboardType={"number-pad"}
                  returnKeyType={"default"}
                  returnKeyType={"done"}
                  //autoCapitalize={capital}
                /> */}

            <Text
              style={{
                fontSize: hp('1.8%'),
                color: 'gray',
                marginBottom: hp('1%'),
              }}>
              {strings.AMOUNT_OF_CHILDREN}
            </Text>
            <TouchableOpacity
              onPress={() => setChildrenEnable(!childrenEnable)}>
              <View
                style={{
                  marginBottom: hp('2%'),
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 4,
                  alignItems: 'center',
                }}>
                <TextInput
                   placeholderTextColor={'#808E95'}
                  style={{
                    fontSize: hp('1.6%'),
                    height: hp('5%'),
                    paddingHorizontal: hp('2%'),
                    width: '90%',
                  }}
                  editable={false}
                  maxLength={45}
                  editable={false}
                  placeholder={strings.AMOUNT_OF_CHILDREN}
                  onChangeText={(txt) => setchildren(txt)}
                  value={children}
                />
                <Image
                  style={{
                    height: hp('4%'),
                    width: hp('4%'),
                    resizeMode: 'contain',
                  }}
                  source={childrenEnable ? DropdownUp : DropdownDown}
                />
              </View>
            </TouchableOpacity>
            {childrenEnable && (
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{
                  width: '100%',
                  backgroundColor: '#F2F2F2',
                  height: hp('15%'),
                  borderRadius: 10,
                }}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: hp('2%'),
                }}>
                {ChildrenLayout}
              </ScrollView>
            )}
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                borderRadius: 8,
                marginTop: hp('1%'),
                width: '90%',
                height: hp('6%'),
                backgroundColor: '#019139',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={updateProfile}>
              <Text style={{color: '#FFF', fontSize: hp('2.2%')}}>
                {' '}
                UPDATE PROFILE{' '}
              </Text>
            </TouchableOpacity>
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={() => setModelVisibile(false)}
              onBackButtonPress={() => setModelVisibile(false)}
              onModalHide={() => setModelVisibile(false)}>
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <View
                  style={{
                    backgroundColor: '#F3F3F3',
                    borderRadius: 20,
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <Text style={{paddingVertical: 12, fontWeight: 'bold'}}>
                    Upload Image
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
                    onPress={() => pickSingle(false)}>
                    Choose from Library
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
                    onPress={() => pickSingleWithCamera(false)}>
                    Take Photo{' '}
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
                      onPress={() => setModelVisibile(false)}
                      style={{
                        width: '100%',
                        paddingVertical: 12,
                        textAlign: 'center',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = {
  textInput: {
    borderWidth: 1,
    flex: 1,
    fontSize: hp('1.6%'),
    borderColor: '#cccccc',
    borderRadius: 4,
    // marginBottom:hp('2%'),
    paddingHorizontal: hp('2%'),
    height: hp('5%'),
  },
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
  datepicker:{
    borderWidth: 1,
    flex: 1,
    fontSize: hp('1.6%'),
    borderColor: '#cccccc',
    borderRadius: 4,
    marginBottom: hp('2%'),
    textAlignVertical:"center",
    paddingHorizontal: hp('2%'),
    height: hp('5%'),
    textAlignVertical:"center",
    color:'grey',
    justifyContent:"center"
  }
};

function mapStateToProps(state) {
  const {hideProgress, drawerUrl} = state.loginReducer;
  return {hideProgress, drawerUrl};
}

export default connect(mapStateToProps, {
  Logout,
  updateDrawer,
  refreshAction,
  updateDrawerUrl,
})(Profile);
