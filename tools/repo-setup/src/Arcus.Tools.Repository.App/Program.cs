using System;
using System.Threading.Tasks;

namespace Arcus.Tools.Repository.App
{
    public class Program
    {
        private const ConsoleColor AnnouncementColor = ConsoleColor.DarkYellow;

        private const string ApplicationIntroduction = @"
 █████╗ ██████╗  ██████╗██╗   ██╗███████╗
██╔══██╗██╔══██╗██╔════╝██║   ██║██╔════╝
███████║██████╔╝██║     ██║   ██║███████╗
██╔══██║██╔══██╗██║     ██║   ██║╚════██║
██║  ██║██║  ██║╚██████╗╚██████╔╝███████║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝";

        private const ConsoleColor RegularColor = ConsoleColor.White;

        public static async Task Main(string[] args)
        {
            WelcomeUser();
            await RunApplication(args);
            CloseApplication();
        }

        private static void CloseApplication()
        {
            Console.WriteLine(value: "Press any key to close the application...");
            Console.ReadLine();
        }

        private static CommandLineParser.CommandLineParser ConfigureCommandLineParser(ConfigureDefaultsCommandLineArguments configureDefaultsCommandLineArguments, string[] args)
        {
            var cmdlineParser = new CommandLineParser.CommandLineParser
            {
                ShowUsageHeader = "Here is how you use the repository provisioning app:",
                ShowUsageFooter = "For more information, see https://github.com/arcus-azure/arcus"
            };

            cmdlineParser.ExtractArgumentAttributes(configureDefaultsCommandLineArguments);
            //cmdlineParser.Arguments.AddRange(commandLineArguments);
            cmdlineParser.ParseCommandLine(args);

            return cmdlineParser;
        }

        private static async Task ConfigureDefaults()
        {
        }

        private static async Task RunApplication(string[] args)
        {
            var configureDefaultsArguments = new ConfigureDefaultsCommandLineArguments();
            //var configureDefaultsArgument = new SwitchArgument(shortName: 'c', longName: "configure-default", description: "Configures the GitHub repository according to our default standards", defaultValue: true);
            //var gitHubUserNameArgument = new ValueArgument<string>(shortName: 'u', longName: "username", description: "Name to authenticate with");
            //var gitHubPasswordArgument = new ValueArgument<string>(shortName: 'p', longName: "password", description: "Password to authenticate with");
            //var gitHubRepoArgument = new ValueArgument<string>(shortName: 'r', longName: "repo-name", description: "Name of the repository to configure");
            //var commandLineArguments = new List<SwitchArgument>
            //{
            //    configureDefaultsArgument
            //};

            var cmdlineParser = ConfigureCommandLineParser(configureDefaultsArguments, args);
            if (configureDefaultsArguments.ConfigureDefaults)
            {
                await ConfigureDefaults();
            }
            else
            {
                ShowUsage(cmdlineParser);
            }
        }

        private static void ShowUsage(CommandLineParser.CommandLineParser cmdlineParser)
        {
            Console.ForegroundColor = AnnouncementColor;
            cmdlineParser.ShowUsage();
            Console.ForegroundColor = RegularColor;
        }

        private static void WelcomeUser()
        {
            Console.ForegroundColor = AnnouncementColor;
            Console.WriteLine(ApplicationIntroduction);
            Console.ForegroundColor = RegularColor;
        }
    }
}