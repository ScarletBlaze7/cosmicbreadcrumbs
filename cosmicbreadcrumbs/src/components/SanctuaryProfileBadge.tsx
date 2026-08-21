import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProfileProps {
  isMember: boolean;
  username: string;
}

export const SanctuaryProfileBadge: React.FC<ProfileProps> = ({ isMember, username }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{username}'s Sanctuary</Text>
      
      {isMember ? (
        <View style={styles.memberBadgeContainer}>
          <Image
            source={require('../../assets/images/emblems/sanctuary_emblem.png')}
            style={styles.emblemImage}
            resizeMode="contain"
          />
          <Text style={styles.memberStatus}>Sanctuary Member</Text>
        </View>
      ) : (
        <View style={styles.lockedContainer}>
          <Image
            source={require('../../assets/images/tarot/card_back.jpg')}
            style={[styles.emblemImage, styles.lockedOverlay]}
            resizeMode="contain"
          />
          <Text style={styles.lockedText}>Unlock Sanctuary Membership</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#E5C07B',
    fontFamily: 'Cinzel',
    fontSize: 20,
    marginBottom: 12,
  },
  memberBadgeContainer: {
    alignItems: 'center',
  },
  emblemImage: {
    width: 220,
    height: 220,
    borderRadius: 16,
  },
  memberStatus: {
    color: '#D4AF37',
    fontSize: 14,
    letterSpacing: 2,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  lockedContainer: {
    alignItems: 'center',
    opacity: 0.6,
  },
  lockedOverlay: {
    opacity: 0.4,
  },
  lockedText: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 8,
  },
});
