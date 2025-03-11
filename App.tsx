import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  // Inject JavaScript to fix CORS issues and properly load the scene
  const injectedJavaScript = `
    window.onerror = function(message, source, lineno, colno, error) {
      console.log('Error:', message, 'Source:', source, 'Line:', lineno);
      return true;
    };
    console.log = function(...args) { window.ReactNativeWebView.postMessage('Log: ' + args.join(' ')); };
    console.error = function(...args) { window.ReactNativeWebView.postMessage('Error: ' + args.join(' ')); };
    true;
  `;

  // Enhanced HTML content with better error handling
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script type="module" src="https://unpkg.com/@splinetool/viewer@0.9.369/build/spline-viewer.js"></script>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        spline-viewer {
          width: 100%;
          height: 100%;
          display: block;
        }
        #loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      <div id="loading">Loading 3D scene...</div>
      <spline-viewer 
        url="https://prod.spline.design/hSqP-2vR9idXIQJF/scene.splinecode"
        events-target="global"
        loading-anim
        style="width: 100%; height: 100%"
      ></spline-viewer>
      <script>
        // Add event listeners to detect loading status
        document.addEventListener('DOMContentLoaded', function() {
          const viewer = document.querySelector('spline-viewer');
          const loading = document.getElementById('loading');
          
          if (viewer) {
            viewer.addEventListener('error', function(e) {
              console.error('Spline viewer error:', e.detail);
              loading.textContent = 'Error loading 3D scene';
            });
            
            viewer.addEventListener('load', function() {
              console.log('Spline scene loaded successfully');
              loading.style.display = 'none';
            });
          }
        });
      </script>
    </body>
    </html>
  `;

  // Log WebView console messages for debugging
  const onMessage = (event) => {
    console.log("WebView message:", event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff'
  },
  webview: { 
    flex: 1,
    backgroundColor: 'transparent'
  },
});

export default App;
