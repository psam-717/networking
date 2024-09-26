import {View, StyleSheet, StatusBar, Text,FlatList, TextInput, Pressable, SafeAreaView, ActivityIndicator} from 'react-native';
import { useState, useEffect } from 'react';


export default function App(){

  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [isPosting, setIsPosting] = useState( false);
  const [refreshing, setIsRefreshing] = useState(false)


  // function to fetch data from the API, with a default number set to 10
  const fetchData = async (limit = 10) => {
    const response = await fetch (
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
    )

    const data = await response.json()

    setPostList(data)
    setLoading(false)
  };

  const handleRefresh = async () => {
    setIsRefreshing(true); // activate the refreshing indicator
    await fetchData(20); // fetch 20 posts on refresh
    setIsRefreshing(false) // deactivate refreshing indicator
  }

  const addPost = async () => {
    setIsPosting(true)

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'post',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify({
        title: postTitle,
        body: postBody
      })
    })

    const newPost = await response.json()
    setPostList([newPost, ...postList]);
    setPostTitle('');
    setPostBody('');
    setIsPosting(false);
  }


  useEffect(() => {fetchData()}, [])

  if (loading){
    return(
      <SafeAreaView style={styles.loadingContainer}>

        <ActivityIndicator
          size={'large'}
          color={'black'}
        />

        <Text>loading ...</Text>
      </SafeAreaView>
    )
  }

  return(

    <View style={styles.container}>


      <View style={styles.inputContainer}>
        <TextInput
          placeholder='post title'
          style={styles.input}
          value={postTitle} // this clears it anytime the page is refreshed
          onChangeText={setPostTitle}  // this makes sure that anything entered in the title text box is shown in the flatlist
        />

        <TextInput
          placeholder='post body'
          style={styles.input}
          onChangeText={setPostBody} // this makes sure that anything entered in the body text box is shown in the flatlist
          value={postBody} // this clears it anytime the page is refreshed
        />

        <Pressable
          style={({pressed}) => [styles.base, pressed && styles.pressed] }
          onPress={addPost}
          disabled={isPosting}
            
          
        >
          <Text style={styles.pressableText}>{isPosting ? 'Adding post' : 'Add Post'} </Text>
        </Pressable>



      </View>

      <View style={styles.listContainer}>

        <FlatList
          data={postList}
          renderItem={({item}) => {
            return(
              <View style={styles.card}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.bodyText}>{item.body}</Text>

              </View>
            )
          }}

          ItemSeparatorComponent={() => (
            <View
              style={{height: 8}}
            />
          )}

          ListHeaderComponent={<Text style={styles.headerText}>POST LIST</Text>}

          refreshing={refreshing}
          onRefresh={handleRefresh}
        />


      </View>

    </View>

  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    padding: 10,
    paddingTop: StatusBar.currentHeight

  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 8,
    margin: 16,
    padding:10
  },
  input : {
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 2,
    padding: 10,
    width: 300,
    marginBottom: 10,
    borderColor: 'grey',
    marginTop: 10
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 5
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 2,
    padding: 10,
    borderRadius: 8
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bodyText: {
    fontSize: 15
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 25,
    fontWeight: 'bold'
  },
  pressed: {
    opacity: 0.5
  },
  pressableText: {
    fontSize: 18,
    color: '#5AD2F4'
  },
  loadingContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
