import Post from './post';
import json from './assets/my-json';
import WebpackLogo from './assets/logo.png';
import './style/style.css';
const post = new Post('Webpack Post Title', WebpackLogo);
console.log('Post to string', post.toString());
console.log('My JSON:', json);