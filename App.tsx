import * as React from 'react'

import { StyleSheet, View, Text, Button } from 'react-native'

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker'
import { useEffect,useState } from 'react'

export default function App() {
  //var fileReader = new (require('react-native-filereader'))();
  const [singleFile, setSingleFile] = useState(null);
  const [result, setResult] = React.useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >()

  useEffect(() => {
    debugger;
    console.log("Result is "+JSON.stringify(result, null, 2))
    setSingleFile(result);
    uploadImage();
    // const fileToUpload = singleFile;
    // const data = new FormData();
    // data.append('name', 'File Upload');
    // data.append('file_attachment', fileToUpload[0]);
    // console.log("Data is "+JSON.stringify(data, null, 2))
    // let res = fetch(
    //   'https://localhost:44342/weatherforecast',
    //   {
    //     method: 'post',
    //     body: data,
    //     headers: {
    //       'Content-Type': 'multipart/form-data; ',
    //     },
    //   }
    // );
    // let responseJson = res.json();
   // var res = fileReader.readAsDataURL(result.uri);
   // console.log(res)
  }, [result])

  const uploadImage = async () => {
    // Check if any file is selected or not
    if (singleFile != null) {
      // If file selected then create FormData
      const fileToUpload = singleFile;
      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_attachment', fileToUpload[0]);
      // Please change file upload URL
      let res = await fetch(
        'https://localhost:44342/weatherforecast',
        {
          method: 'get',
          // body: data,
          // headers: {
          //   'Content-Type': 'multipart/form-data; ',
          // },
        }
      );
      let responseJson = await res.json();
      if (responseJson.status == 1) {
        alert('Upload Successful');
      }
    } else {
      // If no file selected the show alert
      alert('Please Select File first');
    }
  };

  const handleError = (err: unknown) => {
    if (isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title="open picker for single file selection"
        onPress={async () => {
          try {
            const pickerResult = await DocumentPicker.pickSingle({
              presentationStyle: 'fullScreen',
              copyTo: 'cachesDirectory',
            })
            setResult([pickerResult])
          } catch (e) {
            handleError(e)
          }
        }}
      />
      <Button
        title="open picker for multi file selection"
        onPress={() => {
          DocumentPicker.pick({ allowMultiSelection: true }).then(setResult).catch(handleError)
        }}
      />
      <Button
        title="open picker for multi selection of word files"
        onPress={() => {
          DocumentPicker.pick({
            allowMultiSelection: true,
            type: [types.doc, types.docx],
          })
            .then(setResult)
            .catch(handleError)
        }}
      />
      <Button
        title="open picker for single selection of pdf file"
        onPress={() => {
          DocumentPicker.pick({
            type: types.pdf,
          })
            .then(setResult)
            .catch(handleError)
        }}
      />
      <Button
        title="releaseSecureAccess"
        onPress={() => {
          DocumentPicker.releaseSecureAccess([])
            .then(() => {
              console.warn('releaseSecureAccess: success')
            })
            .catch(handleError)
        }}
      />
      <Button
        title="open directory picker"
        onPress={() => {
          DocumentPicker.pickDirectory().then(setResult).catch(handleError)
        }}
      />

      <Text selectable>Result: {JSON.stringify(result, null, 2)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
})
