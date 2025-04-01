import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getPostListFromUser } from '../api/postApi';
import { getImageUrl } from '../utility/fileLink';
import { FullPost } from '../models/fullPost';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPostsUserRate, ratePost, deleteRatePost } from '../api/rateApi';

interface UserPostsProps {
  userId: string;
}

export default function UserPosts({ userId }: UserPostsProps) {
  const [posts, setPosts] = useState<FullPost[]>([]);
  const [ratings, setRatings] = useState<Map<string, number | null>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postList = await getPostListFromUser(userId, 10, 0);
        setPosts(postList);

        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId || postList.length === 0) {
          return;
        }

        const postIds = postList.map(post => post.post.id);

        try {
          const response = await getPostsUserRate(postIds);
          const newRatings = new Map<string, number | null>();
          response.postsRate.forEach((rate) => {
            newRatings.set(rate.postId, rate.rate);
          });
          setRatings(newRatings);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }


      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleRate = async (postId: string, rate: number) => {
    try {
      await ratePost(postId, rate);
      setRatings(prevRatings => new Map(prevRatings).set(postId, rate));
    } catch (err) {
      console.error('Failed to update rating');
    }
  };

  const handleDeleteRate = async (postId: string) => {
    try {
      await deleteRatePost(postId);
      setRatings(prevRatings => {
        const updatedRatings = new Map(prevRatings);
        updatedRatings.delete(postId);
        return updatedRatings;
      });
    } catch (err) {
      console.error('Failed to delete rating');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (posts.length === 0) {
    return <Text style={styles.noPosts}>No posts available</Text>;
  }

  return (
    <ScrollView>
      {posts.map((post) => (
        <View key={post.post.id} style={styles.postCard}>
          {post.post.assetId && (
            <Image
              source={{ uri: getImageUrl(post.post.assetId) }}
              style={styles.postImage}
            />
          )}
          <View style={styles.postInfo}>
            <Text style={styles.postText}>{post.post.text}</Text>
            <Text style={styles.postDate}>Published: {new Date(post.post.uploadDate).toLocaleDateString()}</Text>
            <Text style={styles.postRating}>Rating: {post.rate ?? 0}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <TouchableOpacity
              onPress={() => ratings.get(post.post.id) === 1 ? handleDeleteRate(post.post.id) : handleRate(post.post.id, 1)}
              style={[styles.arrowButton, ratings.get(post.post.id) === 1 && styles.selectedArrowUp]}
            >
              <Text style={[styles.arrowText, ratings.get(post.post.id) === 1 && styles.selectedArrowText]}>↑</Text>
            </TouchableOpacity>
            <Text style={styles.ratingText}>
              {ratings.get(post.post.id) === null ? 'No rating' : ratings.get(post.post.id) === 1 ? '1' : ratings.get(post.post.id) === -1 ? '-1' : 'No rating'}
            </Text>
            <TouchableOpacity
              onPress={() => ratings.get(post.post.id) === -1 ? handleDeleteRate(post.post.id) : handleRate(post.post.id, -1)}
              style={[styles.arrowButton, ratings.get(post.post.id) === -1 && styles.selectedArrowDown]}
            >
              <Text style={[styles.arrowText, ratings.get(post.post.id) === -1 && styles.selectedArrowText]}>↓</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  noPosts: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  postCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postInfo: {
    paddingHorizontal: 5,
  },
  postText: {
    fontSize: 16,
    marginBottom: 5,
  },
  postDate: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  postRating: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrowButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  selectedArrowUp: {
    backgroundColor: '#cce5ff', // Light blue background for active "up" arrow
  },
  selectedArrowDown: {
    backgroundColor: '#ffcccc', // Light red background for active "down" arrow
  },
  arrowText: {
    fontSize: 18,
    color: '#007BFF',
  },
  selectedArrowText: {
    color: '#0056b3', // Darker blue for active text
  },
  ratingText: {
    fontSize: 16,
  },
});
