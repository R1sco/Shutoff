# Android Usage Options

Here are several ways to use the ShutOff server from your Android device:

## 1. HTTP Request Widget

This is the simplest way to create a widget on your Android home screen:

1. Install the "HTTP Request Widget" app from the Play Store
2. Create a new widget with the following configuration:
   - URL: `http://LAPTOP_IP:3000/shutdown` (replace LAPTOP_IP with your laptop's IP address)
   - Method: POST
   - Headers: `x-api-key: your-secret-key-here` (replace with your API key)
3. Repeat to create restart and cancel widgets with different URLs

## 2. Tasker

For more advanced automation:

1. Install Tasker from the Play Store
2. Create a new Task:
   - Add Action: Net > HTTP Request
   - Method: POST
   - URL: `http://LAPTOP_IP:3000/shutdown`
   - Headers: `x-api-key:your-secret-key-here`
3. Create a Tasker widget or integrate with other triggers like time, location, or voice

## 3. REST Client Apps

For a temporary solution without creating a dedicated app:

1. Install a REST client app like "Postman" or "REST Client"
2. Save requests for shutdown, restart, and cancel
3. Use the app as needed

## 4. Creating a Custom Android App

If you want a more elegant solution:

### Example with Android Studio (Java):

```java
// Retrofit service interface
public interface ShutOffService {
    @POST("shutdown")
    Call<ResponseBody> shutdown(@Header("x-api-key") String apiKey);

    @POST("restart")
    Call<ResponseBody> restart(@Header("x-api-key") String apiKey);

    @POST("cancel")
    Call<ResponseBody> cancel(@Header("x-api-key") String apiKey);
}

// Create retrofit client
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("http://LAPTOP_IP:3000/")
    .addConverterFactory(GsonConverterFactory.create())
    .build();

ShutOffService service = retrofit.create(ShutOffService.class);

// Usage example
String apiKey = "your-secret-key-here";
service.shutdown(apiKey).enqueue(new Callback<ResponseBody>() {
    @Override
    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
        // Handle response
    }

    @Override
    public void onFailure(Call<ResponseBody> call, Throwable t) {
        // Handle error
    }
});
```

## 5. Using a Simple Web Application

Create a simple HTML page that can be opened in an Android browser:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ShutOff Control</title>
    <style>
      body {
        font-family: Arial;
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
      }
      button {
        display: block;
        width: 100%;
        padding: 15px;
        margin: 10px 0;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
      }
      .shutdown {
        background: #ff5252;
        color: white;
      }
      .restart {
        background: #2196f3;
        color: white;
      }
      .cancel {
        background: #4caf50;
        color: white;
      }
      input {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        box-sizing: border-box;
      }
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <h1>ShutOff Control</h1>

    <div id="setup" class="hidden">
      <label>Server IP:Port</label>
      <input type="text" id="server" placeholder="192.168.1.x:3000" />

      <label>API Key</label>
      <input type="password" id="apiKey" placeholder="your-secret-key-here" />

      <button onclick="saveSettings()">Save Settings</button>
    </div>

    <div id="controls">
      <button class="shutdown" onclick="sendCommand('shutdown')">
        Shutdown Laptop
      </button>
      <button class="restart" onclick="sendCommand('restart')">
        Restart Laptop
      </button>
      <button class="cancel" onclick="sendCommand('cancel')">
        Cancel Action
      </button>
      <button onclick="showSetup()">Settings</button>
    </div>

    <script>
      // Check for saved settings on load
      window.onload = function () {
        const server = localStorage.getItem("shutoffServer");
        const apiKey = localStorage.getItem("shutoffApiKey");

        if (!server || !apiKey) {
          showSetup();
        } else {
          document.getElementById("server").value = server;
          document.getElementById("apiKey").value = apiKey;
          document.getElementById("controls").classList.remove("hidden");
          document.getElementById("setup").classList.add("hidden");
        }
      };

      function showSetup() {
        document.getElementById("setup").classList.remove("hidden");
        document.getElementById("controls").classList.add("hidden");
      }

      function saveSettings() {
        const server = document.getElementById("server").value;
        const apiKey = document.getElementById("apiKey").value;

        if (!server || !apiKey) {
          alert("Please enter both server and API key");
          return;
        }

        localStorage.setItem("shutoffServer", server);
        localStorage.setItem("shutoffApiKey", apiKey);

        document.getElementById("controls").classList.remove("hidden");
        document.getElementById("setup").classList.add("hidden");
      }

      function sendCommand(command) {
        const server = localStorage.getItem("shutoffServer");
        const apiKey = localStorage.getItem("shutoffApiKey");

        if (!server || !apiKey) {
          showSetup();
          return;
        }

        fetch(`http://${server}/${command}`, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok");
          })
          .then((data) => {
            alert(data.message);
          })
          .catch((error) => {
            alert("Error: " + error.message);
          });
      }
    </script>
  </body>
</html>
```

Save this file on your laptop server (for example as `public/index.html`), then access it through your Android browser.
