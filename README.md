 
<p align="center">
    <a href="http://postgre.org/" target="blank"><img src="https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg" width="40" alt="PostgreSQL Logo" /></a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="http://python.com/" target="blank"><img src="https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg" width="30" alt="Python Logo" /></a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="40" alt="Nest Logo" /></a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="http://vite.org/" target="blank"><img src="https://vitejs.dev/logo.svg" width="40" alt="Vite Logo" /></a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="http://ts.org/" target="blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" alt="TS Logo" /></a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="http://robotframework.org/" target="blank">
      <img src="https://raw.githubusercontent.com/robotframework/visual-identity/main/logo/robot-framework.svg" 
          width="40" 
          alt="Robot Framework" 
          style="background-color: white; padding: 2px; border-radius: 3px;" />
    </a> 
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center"> <a href="http://quanticasoft.org" target="_blank">Gyros</a> Gestion Financiera Logistica.</p>

## Gyros API

1. Clonar proyecto
2. ```yarn install```
3. ```yarn build```
4. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
5. Cambiar las variables de entorno
6. Levantar la base de datos
    ```
    docker-compose up -d
    ```
7. levantar ``` yarn start:dev ```    

## Robot
```python test_device_detection.py```

```robot Test/Device_Detection_Test.robot```

```robot Test/Add_Note_Test.robot```

```python3 test_device_detection.py```

```robot -v usuario:3136202m -v password:Andres2013. -v bs:1 -v glosa:25092025 giro.robot```


## Endpoints
```✅ GET /api/automation/status ```
```✅ GET /api/automation/check-device-id ```
```✅ POST /api/automation/start-process ```
```✅ GET /api/automation/history ```
```✅ POST /api/automation/trigger-scheduled-check ```


## Robot - Automatizacion Python

1. Levantar Appium
    ```
    start Appium 
    ```

2. Levantar script
   ```    
   robot -d Report Test/Add_Note_Test.robot 
   ```


## 

<p align="center"> Powerded by: <a href="http://quanticasoft.org" target="_blank">QUANTICASoft</a> </p>



