import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  ImageBackground,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {
  Forgotpassword,
  Back_Green,
  Correct,
  LogoBG,
} from '../../../Utils/images';
import {Login, Logout} from '../../../Redux/Actions/login_action';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-gesture-handler';
import {validatePassword} from '../../../Utils/Validator';
import {useNavigation} from '@react-navigation/native';
import {changePasswordApi} from '../../../service/Api';
import {strings} from '../../../strings';

const ChangePassword = (props) => {
  const navigation = useNavigation();
  const pass = useRef();
  const newPass = useRef();
  const confirmPass = useRef();

  const [opass, setOldPassword] = useState('');
  const [npass, setNewPassword] = useState('');
  const [cpass, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [validEmail, SetValidEmail] = useState(false);

  changePassword = (email) => {
    if (opass.trim() == '' || npass.trim() == '' || cpass.trim() == '') {
      Toast.show(strings.ALL_FIELDS_MANDATORY);
    } else if (opass.trim() == npass.trim()) {
      Toast.show(strings.OLD_AND_NEW_PASSWORD_CANT_BE_SAME);
    } else if (npass.trim().length < 6) {
      Toast.show(strings.PASSWORD_SHOULD_BE_ATLEAST_FOUR_CHARACTER);
    } 
    // else if (!validatePassword(npass.trim())) {
    //   Toast.show(strings.PASSWORD_MUST_HAVE_EIGHT_OR_MORE_CHARACTERS);
    // } 
    else if (npass.trim() != cpass.trim()) {
      Toast.show(strings.PLEASE_ENTER_THE_SAME_PASSWORD_CHANGE);
    } else {
      changePasswordApiHit();
    }
  };

  const changePasswordApiHit = async () => {
    setLoading(true);
    var bodyFormData = new FormData();
    bodyFormData.append('password', opass);
    bodyFormData.append('new_password', npass);
    bodyFormData.append('new_password_confirmation', cpass);
    await changePasswordApi(bodyFormData)
      .then((response) => {
        console.log('Change Password Success  ' + JSON.stringify(response));
        setLoading(false);
        if (response.status == 200) {
          Toast.show(response.data.message);
          navigation.goBack();
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <View>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flexGrow: 1, height: '100%', backgroundColor: '#FFFFFF'}}>
          <View
            style={{
              height: hp('8%'),
              width: '100%',
              backgroundColor: '#FFF',
              flexDirection: 'row',
              elevation: 10,
              shadowOffset: {height: 0, width: 1},
              shadowColor: 'grey',
              shadowOpacity: 2,
              alignItems: 'center',
              zIndex: 1,
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{width: '20%'}}>
              <Image
                style={{
                  height: '80%',
                  width: '40%',
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={Back_Green}
              />
            </TouchableOpacity>
            <Text
              style={{
                width: '70%',
                fontSize: hp('2.5%'),
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {strings.CHANGE_PASSWORD}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{width: '100%', paddingBottom: 40}}
            style={{width: '96%', alignSelf: 'center'}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="gray" />
              </View>
            ) : null}
            <ImageBackground
              source={LogoBG}
              style={{width: '90%', alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: hp('2%'),
                  alignSelf: 'center',
                  marginTop: hp('8%'),
                }}>
                {strings.PLEASE_ENTER_PASSWORD_AS}
              </Text>
              <Text
                style={{
                  fontSize: hp('2%'),
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginBottom: hp('10%'),
                }}>
                {strings.USE_EIGHT_OR_MORE_CHARS_WITH_MIX}
              </Text>
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  color: 'gray',
                  marginBottom: hp('2%'),
                }}>
                {strings.OLD_PASSWORD}
              </Text>
              <TextInput
                ref={pass}
                placeholderTextColor={'#808E95'}
                maxLength={20}
                style={{
                  fontSize: hp('1.6%'),
                  height: hp('5%'),
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 4,
                  marginBottom: hp('3%'),
                  paddingHorizontal: hp('2%'),
                  backgroundColor: '#FFF',
                }}
                //returnKeyType={ReturnType}
                onSubmitEditing={() => {
                  newPass.current.focus();
                }}
                placeholder={strings.ENTER_OLD_PASSWORD}
                onChangeText={(password) => setOldPassword(password)}
                value={opass}
                secureTextEntry={true}
              />
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  color: 'gray',
                  marginBottom: hp('2%'),
                }}>
                {strings.NEW_PASSWORD}
              </Text>
              <TextInput
                ref={newPass}
                maxLength={20}
                placeholderTextColor={'#808E95'}
                style={{
                  fontSize: hp('1.6%'),
                  height: hp('5%'),
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 4,
                  marginBottom: hp('3%'),
                  paddingHorizontal: hp('2%'),
                  backgroundColor: '#FFF',
                }}
                //returnKeyType={ReturnType}
                onSubmitEditing={() => {
                  confirmPass.current.focus();
                }}
                placeholder={strings.ENTER_NEW_PASSWORD}
                onChangeText={(password) => setNewPassword(password)}
                value={npass}
                secureTextEntry={true}
              />
              <Text
                style={{
                  fontSize: hp('1.8%'),
                  color: 'gray',
                  marginBottom: hp('2%'),
                }}>
                {strings.CONFIRM_NEW_PASSWORD}
              </Text>
              <TextInput
                ref={confirmPass}
                maxLength={20}
                placeholderTextColor={'#808E95'}
                style={{
                  fontSize: hp('1.6%'),
                  height: hp('5%'),
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 4,
                  marginBottom: hp('3%'),
                  paddingHorizontal: hp('2%'),
                  backgroundColor: '#FFF',
                }}
                //returnKeyType={ReturnType}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                placeholder={strings.ENTER_CONFIRM_NEW_PASSWORD}
                onChangeText={(password) => setConfirmPassword(password)}
                value={cpass}
                secureTextEntry={true}
              />

              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  borderRadius: 8,
                  marginTop: hp('15%'),
                  width: '90%',
                  height: hp('6%'),
                  backgroundColor: '#019139',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={changePassword}>
                <Text style={{color: '#FFF', fontSize: hp('2.2%')}}>
                  {' '}
                  {strings.CHANGE_PASSWORD_CAPS}{' '}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

function mapStateToProps(state) {
  const {hideProgress} = state.loginReducer;
  return {hideProgress};
}

export default connect(mapStateToProps, {Login, Logout})(ChangePassword);
