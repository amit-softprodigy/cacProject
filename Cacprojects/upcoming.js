import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {DropdownDown, DropdownUp} from '../../../Utils/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Login, Logout} from '../../../Redux/Actions/login_action';
import {useNavigation, useRoute} from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import {set} from 'react-native-reanimated';
import {getCacProjects, participateApi} from '../../../service/Api';
import {strings} from '../../../strings';

const Upcomingproject = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [upcoming, setupcoming] = useState([]);
  const [refreshArrow, setRefresh] = useState(false);

  React.useEffect(() => {
    setupcoming(props.upcominglist);
  }, [props.upcominglist]);

  const expand = (i) => {
    let array = upcoming;
    for (var j = 0; j < array.length; j++) {
      if (i == j) {
        array[j].statusArrow = !array[i].statusArrow;
      } else {
        array[j].statusArrow = false;
      }
    }
    //  console.log(JSON.stringify(array))
    setupcoming(array);
    setRefresh(!refreshArrow);
  };
  function participateCall(id) {
    props.particiapteApi(id);
  }
  function showdate(date, index) {
    var start_date = date.split('-').reverse().join('/');
    return (
      <Text numberOfLines={1} style={{color: 'gray', fontSize: hp('1.2%')}}>
        {start_date}
      </Text>
    );
  }
  return (
    <View style={{width: '100%', height: '100%'}}>
      {props.upcominglist != undefined &&
      props.upcominglist != null &&
      props.upcominglist.length != 0 ? (
        <FlatList
          data={props.upcominglist}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          //ItemSeparatorComponent={this.renderSeparator}
          contentContainerStyle={{paddingVertical: 20}}
          renderItem={({item, index}) => (
            <View>
              <View
                style={{
                  borderRadius: 5,
                  borderBottomColor: 'gray',
                  shadowOffset: {height: 1, width: 1},
                  shadowOpacity: 0.4,
                  elevation: 10,
                  backgroundColor: '#fff',
                  width: '90%',
                  alignSelf: 'center',
                  marginBottom: hp('2.5%'),
                }}>
                <TouchableOpacity
                  onPress={() => expand(index)}
                  style={{
                    paddingVertical: hp('1.5%'),
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginBotttom: 20,
                  }}>
                  <View style={{width: '75%'}}>
                    <Text
                      numberOfLines={3}
                      style={{
                        color: 'black',
                        fontSize: hp('1.5%'),
                        fontWeight: 'bold',
                      }}>
                      {item.name}
                    </Text>
                    {showdate(item.start_date, index)}
                    {item.participation_status != '' ? (
                      item.participation_status == 'approved' ? (
                        <Text
                          style={{
                            width: '100%',
                            color: '#019139',
                            fontSize: hp('1.7%'),
                            fontWeight: 'bold',
                          }}>
                          {item.participation_status}
                        </Text>
                      ) : item.participation_status == 'rejected' ? (
                        <Text
                          style={{
                            width: '100%',
                            color: 'red',
                            fontSize: hp('1.7%'),
                            fontWeight: 'bold',
                          }}>
                          {item.participation_status}
                        </Text>
                      ) : item.participation_status == 'pending' ? (
                        <Text
                          style={{
                            width: '100%',
                            color: '#FF9966',
                            fontSize: hp('1.7%'),
                            fontWeight: 'bold',
                          }}>
                          {item.participation_status}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            width: '100%',
                            color: '#000',
                            fontSize: hp('1.7%'),
                            fontWeight: 'bold',
                          }}>
                          {item.participation_status}
                        </Text>
                      )
                    ) : null}
                  </View>
                  {upcoming.length == 0 ? null : (
                    <Image
                      source={
                        !upcoming[index].statusArrow ? DropdownDown : DropdownUp
                      }
                      style={{
                        width: hp('3%'),
                        height: hp('3%'),
                        alignSelf: 'center',
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {upcoming.length == 0 ? null : (
                <Collapsible
                  duration={500}
                  expandMultiple={false}
                  collapsed={!upcoming[index].statusArrow}
                  style={{width: '85%', alignSelf: 'center'}}>
                  <Text
                    style={{
                      paddingBottom: 15,
                      width: '100%',
                      color: '#000',
                      fontSize: hp('1.8%'),
                    }}>
                    {item.description}
                  </Text>
                  {item.participate ? (
                    item.participation_status == 'approved' ? null : (
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          borderRadius: 8,
                          marginBottom: hp('2%'),
                          width: '90%',
                          height: hp('5%'),
                          backgroundColor: '#019139',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{color: '#FFF', fontSize: hp('1.8%')}}>
                          {' '}
                          {strings.PENDING_CAPS}{' '}
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        participateCall(item.id);
                      }}
                      style={{
                        alignSelf: 'center',
                        borderRadius: 8,
                        marginBottom: hp('2%'),
                        width: '90%',
                        height: hp('5%'),
                        backgroundColor: '#019139',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: '#FFF', fontSize: hp('1.8%')}}>
                        {' '}
                        {strings.PARTICIPATE_TO_THIS_PROJECT}{' '}
                      </Text>
                    </TouchableOpacity>
                  )}
                </Collapsible>
              )}
            </View>
          )}
        />
      ) : (
        <View
          style={{
            height: '50%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!props.loading ? (
            <Text style={{fontSize: hp(2)}}>
              {strings.PROJECTS_PLACEHOLDER}
            </Text>
          ) : (
            <Text></Text>
          )}
        </View>
      )}
    </View>
  );
};

function mapStateToProps(state) {
  const {hideProgress} = state.loginReducer;
  return {hideProgress};
}

export default connect(mapStateToProps, {})(Upcomingproject);
