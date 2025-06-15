import { useState } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { WelcomeLoader } from "./components/WelcomeLoader";

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      {!loadingComplete && <WelcomeLoader onFinish={() => setLoadingComplete(true)} />}
      {loadingComplete && (
        <>
          <Loader />
          <Leva  hidden  />
          <UI/>
          <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
            <Experience />
          </Canvas>
        </>
      )}
    </>
  );
}

export default App;
