import {
    createBrowserRouter,
  } from "react-router-dom";
import Whiteboard from "../pages/Whiteboard";
import WhiteboardEditor from "../pages/WhiteboardEditor";

  const router = createBrowserRouter([
    {
        path: "/",
        element: <WhiteboardEditor />
      },
      {
        path: "/whiteboard",
        element: <Whiteboard />
    }
  ])

  export default router;