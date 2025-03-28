import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTrackComments, addTrackComment } from '../api/commentApi';
import { FullComment } from '../models/fullComment';
import { getImageUrl } from '../utility/fileLink';

interface CommentsSectionProps {
  trackId: string;
}

export default function CommentsSection({ trackId }: CommentsSectionProps) {
  const [comments, setComments] = useState<FullComment[]>([]);
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getTrackComments(trackId, 10, 0);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [trackId]);

  const handleAddComment = async () => {
    if (!message.trim()) return;
    try {
      await addTrackComment(trackId, { Message: message, ReplyTo: null });
      setMessage('');
      const updatedComments = await getTrackComments(trackId, 10, 0);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Comments</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleAddComment} />
      </View>
      {comments.map((comment) => (
        <View key={comment.comment?.id} style={styles.commentContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: comment.userInfo?.id })}>
            <Image
              source={{ uri: comment.userInfo?.avatarId ? getImageUrl(comment.userInfo.avatarId) : 'https://example.com/default-avatar.jpg' }}
              style={styles.userAvatar}
            />
          </TouchableOpacity>
          <View style={styles.commentContent}>
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: comment.userInfo?.id })}>
              <Text style={styles.userName}>{comment.userInfo?.nickname}</Text>
            </TouchableOpacity>
            <Text>{comment.comment?.message}</Text>
            <Text style={styles.commentDate}>{new Date(comment.comment?.sendAt || '').toLocaleString()}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
});
