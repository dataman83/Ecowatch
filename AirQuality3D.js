import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';
import { Howl } from 'howler';

const AirQuality3D = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5022/api/airquality')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    const sound = new Howl({
      src: ['/wind.mp3'], 
      autoplay: true,
      loop: true,
      volume: 0.5,
    });
    sound.play();

    return () => {
      sound.stop();
    };
  }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars />
      <OrbitControls />

      {/* Create the 3D mountain */}
      <mesh>
        <coneGeometry args={[5, 20, 32]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>

      {/* Display the air quality data as text hovering above the mountain */}
      {data.map((item, index) => (
        <mesh key={item.id} position={[0, 5 + index * 2, 0]}>
          <textGeometry args={[`${item.city}: ${item.airQualityIndex} AQI`, { size: 1, height: 0.1 }]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
    </Canvas>
  );
};

export default AirQuality3D;
