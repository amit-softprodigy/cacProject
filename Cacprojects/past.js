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
import {strings} from '../../../strings';
const Pastproject = (props) => {
  const navigation = useNavigation();
  const route = useRoute();

  const [pastArray, setpastArray] = useState([]);
  const [refreshArrow, setRefresh] = useState(false);
  React.useEffect(() => {
    setpastArray(props.pastlist);
  }, [props.pastlist]);

  const expand = (i) => {
    let array = pastArray;
    for (var j = 0; j < array.length; j++) {
      if (i == j) {
        array[j].statusArrow = !array[i].statusArrow;
      } else {
        array[j].statusArrow = false;
      }
    }
    //console.log(JSON.stringify(array))
    setpastArray(array);
    setRefresh(!refreshArrow);
  };
  function showdate(date, index) {
    // if (index == 0) {
    //setpastArray(props.pastlist)
    // console.log(JSON.stringify(pastArray))
    //}
    var start_date = date.split('-').reverse().join('/');
    return (
      <Text numberOfLines={1} style={{color: 'gray', fontSize: hp('1.2%')}}>
        {start_date}
      </Text>
    );
  }
  return (
    <View style={{width: '100%', height: '100%'}}>
      {props.pastlist != undefined &&
      props.pastlist != null &&
      props.pastlist.length != 0 ? (
        <FlatList
          data={props.pastlist}
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
                  {pastArray.length == 0 ? null : (
                    <Image
                      source={
                        !pastArray[index].statusArrow
                          ? DropdownDown
                          : DropdownUp
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
              {pastArray.length == 0 ? null : (
                <Collapsible
                  duration={500}
                  expandMultiple={false}
                  collapsed={!pastArray[index].statusArrow}
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

export default connect(mapStateToProps, {})(Pastproject);
