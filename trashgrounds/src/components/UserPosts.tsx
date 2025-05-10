import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getPostListFromUser } from '../api/postApi';
import { getImageUrl } from '../utility/fileLink';
import { FullPost } from '../models/fullPost';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPostsUserRate, ratePost, deleteRatePost } from '../api/rateApi';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
        if (!storedUserId || postList.length === 0) return;

        const postIds = postList.map(post => post.post.id);
        const response = await getPostsUserRate(postIds);
        const newRatings = new Map<string, number | null>();
        response.postsRate.forEach((rate) => {
          newRatings.set(rate.postId, rate.rate);
        });
        setRatings(newRatings);
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
      setRatings(prev => new Map(prev).set(postId, rate));
    } catch (err) {
      console.error('Failed to update rating');
    }
  };

  const handleDeleteRate = async (postId: string) => {
    try {
      await deleteRatePost(postId);
      setRatings(prev => {
        const updated = new Map(prev);
        updated.delete(postId);
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete rating');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>No posts yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {posts.map((post) => (
        <View key={post.post.id} style={styles.postCard}>
          {post.post.assetId && (
            <Image
              source={{ uri: getImageUrl(post.post.assetId) }}
              style={styles.postImage}
            />
          )}
          
          <View style={styles.postContent}>
            <Text style={styles.postText}>{post.post.text}</Text>
            
            <View style={styles.postMeta}>
              <Text style={styles.postDate}>
                <Ionicons name="time-outline" size={14} color="#666" />{' '}
                {new Date(post.post.uploadDate).toLocaleDateString()}
              </Text>
              <Text style={styles.postRating}>
                <Ionicons name="star" size={14} color="#FFD700" />{' '}
                {post.rate?.toFixed(1) || '0.0'}
              </Text>
            </View>
            
            <LinearGradient
              colors={['#f8f9fa', '#e9ecef']}
              style={styles.ratingContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity
                onPress={() => ratings.get(post.post.id) === 1 ? 
                  handleDeleteRate(post.post.id) : 
                  handleRate(post.post.id, 1)}
                style={[
                  styles.rateButton, 
                  styles.likeButton,
                  ratings.get(post.post.id) === 1 && styles.activeLike
                ]}
              >
                <Ionicons 
                  name="thumbs-up" 
                  size={20} 
                  color={ratings.get(post.post.id) === 1 ? '#fff' : '#4a6bff'} 
                />
              </TouchableOpacity>
              
              <Text style={styles.ratingValue}>
                {ratings.get(post.post.id) === 1 ? 'Liked' : 
                 ratings.get(post.post.id) === -1 ? 'Disliked' : 'Rate'}
              </Text>
              
              <TouchableOpacity
                onPress={() => ratings.get(post.post.id) === -1 ? 
                  handleDeleteRate(post.post.id) : 
                  handleRate(post.post.id, -1)}
                style={[
                  styles.rateButton, 
                  styles.dislikeButton,
                  ratings.get(post.post.id) === -1 && styles.activeDislike
                ]}
              >
                <Ionicons 
                  name="thumbs-down" 
                  size={20} 
                  color={ratings.get(post.post.id) === -1 ? '#fff' : '#dc3545'} 
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 16,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  postDate: {
    fontSize: 14,
    color: '#666',
  },
  postRating: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  rateButton: {
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: 'rgba(74, 107, 255, 0.1)',
  },
  dislikeButton: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
  activeLike: {
    backgroundColor: '#4a6bff',
  },
  activeDislike: {
    backgroundColor: '#dc3545',
  },
  ratingValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});