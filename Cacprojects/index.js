import React, {Component, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {
  LogoBG,
  Training,
  GlobalProjects,
  Insurance,
  Funding,
  CloseIcon,
} from '../../../Utils/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Login, Logout} from '../../../Redux/Actions/login_action';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getCacProjects, participateApi} from '../../../service/Api';
import Upcoming from './upcoming';
import Ongoing from './ongoing';
import Past from './past';
import upcoming from './upcoming';
import Toast from 'react-native-simple-toast';
import {strings} from '../../../strings';

const Cacprojects = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tab, settab] = useState(0);
  const [cacProjectsData, setCacProjectsData] = useState('');
  const [upcomingArray, setUpcomingArray] = useState('');
  const [ongoingArray, setOngoingArray] = useState('');
  const [pastArray, setPastArray] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    getCacProjectsData();
  }, []);
  async function getCacProjectsData() {
    setLoading(true);
    await getCacProjects()
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          // console.log("cac project data" + JSON.stringify(response.data.data))
          setCacProjectsData(response.data.data);
          setArrays(response.data.data);
        } else {
          Toast.show(response.data.errors);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Cac Project  ' + JSON.stringify(error));
        // Toast.show(errors)
      });
  }
  async function participateInProject(id) {
    setLoading(true);
    await participateApi(id)
      .then((response) => {
        //alert(response.data.message)
        if (response.status == 200) {
          Toast.show(response.data.message);
          getCacProjectsData();
        } else {
          Toast.show(response.data.errors);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Partcipate  ' + JSON.stringify(error));
        // Toast.show(errors)
      });
  }
  function setArrays(data) {
    let upcoming = data.upcoming;
    upcoming.map((item, index) => {
      return (item.statusArrow = false);
    });
    setUpcomingArray(upcoming);
    let ongoing = data.ongoing;
    ongoing.map((item, index) => {
      return (item.statusArrow = false);
    });
    setOngoingArray(ongoing);
    let past = data.myprojects;
    past.map((item, index) => {
      return (item.statusArrow = false);
    });
    setPastArray(past);
    //console.log("--"+JSON.stringify(upcoming))
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <ImageBackground
        source={LogoBG}
        style={{
          width: '100%',
          backgroundColor: '#FFF',
          height: '100%',
          resizeMode: 'contain',
        }}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="gray" />
          </View>
        ) : null}
        <View
          style={{
            height: '8%',
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
            {strings.CAC_PROJECTS}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            marginVertical: hp('2%'),
          }}>
          <TouchableOpacity
            onPress={() => settab(0)}
            style={{
              width: '35%',
              backgroundColor: tab == 0 ? '#019139' : '#FFF',
              borderWidth: 1,
              borderColor: '#bfbfbf',
              borderRadius: 5,
              height: hp('5%'),
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: tab == 0 ? '#FFF' : '#000',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: hp('1.7%'),
              }}>
              {strings.UPCOMING_PROJECTS}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => settab(1)}
            style={{
              width: '30%',
              backgroundColor: tab == 1 ? '#019139' : '#FFF',
              borderWidth: 1,
              borderColor: '#bfbfbf',
              borderRadius: 5,
              height: hp('5%'),
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: tab == 1 ? '#FFF' : '#000',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: hp('1.7%'),
              }}>
              {strings.ONGOING_PROJECTS}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => settab(2)}
            style={{
              width: '25%',
              backgroundColor: tab == 2 ? '#019139' : '#FFF',
              borderWidth: 1,
              borderColor: '#bfbfbf',
              borderRadius: 5,
              height: hp('5%'),
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: tab == 2 ? '#FFF' : '#000',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: hp('1.7%'),
              }}>
              {strings.MY_PROJECTS}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{height: '83%'}}>
          {tab == 0 ? (
            <Upcoming
              loading={loading}
              upcominglist={upcomingArray}
              particiapteApi={(id) => {
                participateInProject(id);
              }}
            />
          ) : null}

          {tab == 1 ? (
            <Ongoing
              loading={loading}
              ongoinglist={ongoingArray}
              particiapteApi={(id) => {
                participateInProject(id);
              }}
            />
          ) : null}

          {tab == 2 ? <Past loading={loading} pastlist={pastArray} /> : null}
        </View>
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
  const {hideProgress} = state.loginReducer;
  return {hideProgress};
}

export default connect(mapStateToProps, {})(Cacprojects);
