# Reflector Log Library

## Version 1.0.x

This library is currently in alpha version. Keep in mind, An alpha version of a software product is a pre-release version that is typically not complete but includes most of the major features. It's often used for internal testing and development purposes.

**Here are some key points about alpha versions:**

- Not feature-complete: Some features may be missing or incomplete.
- Internal testing: Alpha versions are often used for testing within the development team or organization.
- Bugs and instability: Because it's a pre-release version, an alpha version may have bugs and could be unstable.
- Feedback and improvements: The purpose of releasing an alpha version is to gather feedback and make improvements before releasing a more stable beta version.
- Remember, using an alpha version in a production environment is generally not recommended due to potential instability and the presence of bugs.
- This repository and code is supported by: @github/beyondnetperu

### Structure

| Field                            | Description                                                                                                                                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {datetime}                       | Date and Time in UTC Format                                                                                                                                                                                                                     |
| [RequestId: {requestid}]         | Each interceptor has to generate a Request ID, this id is related to a specific execution.                                                                                                                                                      |
| [{targettype}.cs, {methodinfo}]: | Target Type is the name of the main class root. Method Info contains the name of the method executed.                                                                                                                                           |
| [Tracking ID:{trackingid}]       | This is a specific mark or tag delivered by the client to define segments of data. In case we do not give this value, the system will create internally a new one based on GUIDs strategy. Only shown when the useTracking behavior is enabled. |
| {took}                           | Time in milliseconds that delay to execute the code.                                                                                                                                                                                            |
| {returnedvalue}:                 | Show the value returned after executing the logic inside the method.                                                                                                                                                                            |
| {params}                         | List arguments used inside the method.                                                                                                                                                                                                          |

- if TRACKING behavior is enabled we will be trying to get the tracking ID from the Body in case of HTTP requests. If the tracking ID does not exist we will be generating a new one in a GUID format.

# Features Supported:

- [x] Log method decorator
- [ ] Log Property decorator
- [ ] Log Class decorator
- [ ] Log Parameter decorator
- [ ] Print to console default NESTJS Logger
- [ ] Print to console Winston Logger
- [ ] Print log to CSV
- [ ] Print log to Txt
- [ ] Print log to Xml
- [ ] Print log to JSON
- [ ] Support for New Relic
- [ ] Support for Logstash

# Sample of Use

To see more samples detailed you can look inside the demo code at the main root.

```
@Controller('appcontrollers')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('post-controller')
  @LogMethod()
  getController(): string {
    return this.appService.print();
  }
}
```

**Basic configuration**

```
@Module({
  imports: [
    ConfigModule.forRoot(),
    ***
    LogReflectorModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        behavior: {
          useProduction: configService.get('NODE_ENV') === 'production',
          useTracking: false,
        },
        serializer: 'json',
        extension: 'default',
        output: 'console',
      }),
      inject: [ConfigService],
    }),
    ***
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],

  controllers: [AppController],
  providers: [AppService, AppResolver, **...requestContextInterceptors**],
})
export class AppModule {}
```
