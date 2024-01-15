import { useEffect, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Camera, CameraType as ExpoCameraType } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'

export default function App() {
  const [hasPermission, setHasPermission] = useState(false)
  const [cameraType, setCameraType] = useState(ExpoCameraType.back)
  const cameraRef = useRef<Camera>(null)

  async function requestCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === 'granted')
  }

  function flipCamera() {
    setCameraType(
      cameraType === ExpoCameraType.back
        ? ExpoCameraType.front
        : ExpoCameraType.back,
    )
  }

  useEffect(() => {
    requestCameraPermission()
  }, [])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={cameraRef} type={cameraType}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingTop: 45,
            paddingRight: 15,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              borderRadius: 50,
              padding: 10,
            }}
            onPress={flipCamera}
          >
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}
