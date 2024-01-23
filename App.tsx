import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { Camera, CameraType as ExpoCameraType } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'

export default function App() {
  const [hasPermission, setHasPermission] = useState(false)
  const [cameraType, setCameraType] = useState(ExpoCameraType.back)
  const [signal, setSignal] = useState('')
  const [loading, setLoading] = useState(false)
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

  async function handleTakePicture() {
    setLoading(true)
    const photo = await cameraRef?.current?.takePictureAsync()
    const image = {
      uri: photo?.uri,
      type: 'image/png',
      name: 'photo.png',
    }

    const formData = new FormData()
    formData.append('file', image as any)

    fetch('http://192.168.1.69:8000/predict/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.signal === 'NO_SIGNAL_FOUND') {
          setSignal('Não foi possível identificar o sinal')
        } else {
          setSignal(data.signal)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log('error', error)
        setSignal('Ocorreu um erro ao identificar o sinal')
        setLoading(false)
      })
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
    <>
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} ref={cameraRef} type={cameraType}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 45,
              paddingHorizontal: 30,
              backgroundColor: '#6366f1',
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Libras Interpreter
            </Text>

            <TouchableOpacity onPress={flipCamera}>
              <Ionicons name="camera-reverse-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {signal && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 48,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  paddingVertical: 20,
                  paddingHorizontal: 20,
                }}
              >
                {signal}
              </Text>
            </View>
          )}

          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: 40,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: '#6366f1',
                borderRadius: 50,
                padding: 15,
              }}
              onPress={handleTakePicture}
            >
              <Ionicons name="camera-outline" size={42} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      </View>

      {loading && (
        <View
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  )
}
