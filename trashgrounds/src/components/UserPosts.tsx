import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getPostListFromUser } from '../api/postApi';
import { getImageUrl } from '../utility/fileLink';
import { FullPost } from '../models/fullPost';

interface UserPostsProps {
  userId: string;
}

export default function UserPosts({ userId }: UserPostsProps) {
  const [posts, setPosts] = useState<FullPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postList = await getPostListFromUser(userId, 10, 0); // Берём 10 постов, можно менять
        setPosts(postList);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

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
  postRating: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
