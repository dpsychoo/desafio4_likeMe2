import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";
import { successToast, errorToast } from "./components/utils/toast.js";
//import { getPosts, addPost, deletePost, likePost } from "./components/services/postService.js";

const urlBaseServer = "http://localhost:3001"; 

function App() {
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSRC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);


  const fetchPosts = async () => {
    try {
      const { data: posts } = await axios.get(urlBaseServer + "/posts");
      setPosts(posts);
    } catch (error) {
      errorToast("Error al obtener los posts");
    }
  };

  // Agregar un nuevo post
  const agregarPost = async () => {
    if (!titulo.trim() || !imgSrc.trim() || !descripcion.trim()) {
      return errorToast("Todos los campos son obligatorios");
    }
    try {
      const post = { titulo, img: imgSrc, descripcion };
      await axios.post(urlBaseServer + "/posts", post);
      successToast("Post agregado correctamente");
      setTitulo("");
      setImgSRC("");
      setDescripcion("");
      fetchPosts();
    } catch (error) {
      errorToast("Error al agregar el post");
    }
  };

  // Dar like a un post
  const like = async (id) => {
    try {
      await axios.put(urlBaseServer + `/posts/like/${id}`);
      fetchPosts();
      successToast("¡Te gustó este post!");
    } catch (error) {
      errorToast("Error al dar like");
    }
  };

  // Eliminar un post
  const eliminarPost = async (id) => {
    try {
      await axios.delete(urlBaseServer + `/posts/${id}`);
      fetchPosts();
      successToast("Post eliminado correctamente");
    } catch (error) {
      errorToast("Error al eliminar el post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        {/* Formulario para agregar un post */}
        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImgSRC={setImgSRC}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        {/* Lista de posts */}
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post
              key={post.id} // Cambié a `post.id` para evitar errores al eliminar/editar
              post={post}
              like={like}
              eliminarPost={eliminarPost}
            />
          ))}
          {posts.length === 0 && (
            <div className="text-center mt-5">
              <h3>No hay posts aún</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
