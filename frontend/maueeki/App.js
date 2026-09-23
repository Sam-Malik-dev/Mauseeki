import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Front from './Screens/Front/Front';
import Signup from './Screens/Registration/Signup/Signup';
import Login from './Screens/Registration/Login/Login';
import MainTabs from './Screens/MainTabs/MainTabs';
import PlayerScreen from './Screens/PlayerScreen/PlayerScreen';
import UpdateProfile from './Screens/UpdateProfile/UpdateProfile'
import Activities from './Screens/Activities/Activities'
import ArtistAlbum from './Screens/ArtistAlbum/ArtistAlbum';
import AllArtists from './Screens/AllArtists/AllArtists'
import ShowLikes from './Screens/ShowLIkes/ShowLikes';
import YourFav from './Screens/YourFav/YourFav';
import Followed from './Screens/Followed/Followed';
import AllAlbums from './Screens/AllAlbums/AllAlbums';
import AlbumSongs from './Screens/AlbumSongs/AlbumSongs';
import YourSongs from './Screens/Activities/YourActivities/YourSongs/YourSongs';
import YourAlbums from './Screens/Activities/YourActivities/YourAlbums/YourAlbums';
import YourArtists from './Screens/Activities/YourActivities/YourArtists/YourArtists';
import ContactScreen from './Screens/Contact/Contact';
import { MusicPlayerProvider } from './Screens/MusicPlayerContext/MusicPlayerContext';
import MiniPlayer from './Screens/MiniPlayer/MiniPlayer';
import YourArtistAlbum from './Screens/Activities/YourActivities/YourArtists/ArtistAlbum/YourArtistAlbum';
import YourAlbumSongs from './Screens/Activities/YourActivities/YourAlbums/AlbumSongs/YourAlbumSongs';
import AddAlbum from './Screens/AddAlbum/AddAlbum';
import AddYourAlbum from './Screens/Activities/YourActivities/YourAlbums/AddYourAlbum/AddYourAlbum';
import AddYourSongs from './Screens/Activities/YourActivities/YourSongs/AddYourSongs/AddYourSongs';
import AddArtist from './Screens/AddArtist/AddArtist';
import YourPlaylist from './Screens/YourPlaylist/YourPlaylist';
import PlaylistSongs from './Screens/PlaylistSongs/PlaylistSongs';
import AddSongs from './Screens/AddSongs/AddSongs';


const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="front" component={Front} />
      <Stack.Screen name="sign" component={Signup} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="Play" component={PlayerScreen} />
      <Stack.Screen name="edit-profile" component={UpdateProfile} />
      <Stack.Screen name="activities" component={Activities} />
      <Stack.Screen name="all-artists" component={AllArtists} />
      <Stack.Screen name="artist" component={ArtistAlbum} />
      <Stack.Screen name="Likes" component={ShowLikes} />
      <Stack.Screen name="Fav" component={YourFav} />
      <Stack.Screen name="followed" component={Followed} />
      <Stack.Screen name="all-albums" component={AllAlbums} />
      <Stack.Screen name="albumSongs" component={AlbumSongs} />
      <Stack.Screen name="Your-songs" component={YourSongs} />
      <Stack.Screen name="Your-albums" component={YourAlbums} />
      <Stack.Screen name="Your-artists" component={YourArtists} />
      <Stack.Screen name="contactus" component={ContactScreen} />
      <Stack.Screen name="your-artistalbum" component={YourArtistAlbum} />
      <Stack.Screen name="your-albumSongs" component={YourAlbumSongs} />
      <Stack.Screen name="Add-Album" component={AddAlbum} />
      <Stack.Screen name="add-albums" component={AddYourAlbum} />
      <Stack.Screen name="add-songs" component={AddYourSongs} />
      <Stack.Screen name="add-artist" component={AddArtist} />
      <Stack.Screen name="your-playlist" component={YourPlaylist} />
      <Stack.Screen name="PlaylistSongs" component={PlaylistSongs} />
      <Stack.Screen name="add-song" component={AddSongs} />
      


      {/* Main app with navbar */}
      <Stack.Screen name="main" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <MusicPlayerProvider>
      <NavigationContainer>
        <RootStack />

        <MiniPlayer />
      </NavigationContainer>
    </MusicPlayerProvider>
  );
}