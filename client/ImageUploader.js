import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, View, Image, Text, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';

function generateRNFile(uri, name) {
  return uri ? new ReactNativeFile({
    uri,
    type: mime.lookup(uri) || 'image',
    name,
  }) : null;
}

const UPLOAD_IMAGE = gql`
  mutation uploadImage($image: Upload) {
    uploadImage(image: $image)
  }
`;

export default function App() {

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [uploadImage, { data, loading }] = useMutation(UPLOAD_IMAGE);

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  async function pickImage () {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  async function onUploadPress() {
    status && setStatus(null);
    const file = generateRNFile(image, `picture-${Date.now()}`);
    try {
      await uploadImage({
        variables: { image: file },
      });
      setStatus('Uploaded')
    } catch (e) {
      setStatus('Error')
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage}/>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {image && <Button title={ loading ? "Uploading" : "Upload"} onPress={onUploadPress} disabled={loading}/>}
      {
        loading && (
          <ActivityIndicator size="small" style={styles.loading}/>
        )
      }
      <Text style={{ color: status === 'Uploaded' ? 'green' : 'red'}}>{status}</Text>
      {
        status === 'Uploaded' && (
          <Text>URL: {data.uploadImage}</Text>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    margin: 16,
  }
});
