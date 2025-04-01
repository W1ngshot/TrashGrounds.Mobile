import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserInformation } from '../models/userInformation';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';

interface UserInfoSectionProps {
  userInfo: UserInformation;
}

function UserInfoSection({ userInfo }: UserInfoSectionProps) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: userInfo.id })}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{
            uri: userInfo.avatarId ? getImageUrl(userInfo.avatarId) : getDefaultImageUrl(),
          }}
          style={styles.userAvatar}
        />
        <View>
          <Text style={styles.userName}>{userInfo.nickname}</Text>
          <Text>{new Date(userInfo.registrationDate).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserInfoSection;