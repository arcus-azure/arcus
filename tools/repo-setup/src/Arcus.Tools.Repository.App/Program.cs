using System;
using System.Threading.Tasks;
using Arcus.Tools.Repository.App.Configuration;
using Arcus.Tools.Repository.App.Configurators;
using CommandLineParser.Exceptions;

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

        private const ConsoleColor RegularColor = ConsoleColor.Gray;

        public static async Task Main(string[] args)
        {
            WelcomeUser();
            await RunApplication(args);
            CloseApplication();
        }

        private static void CloseApplication()
        {
            Console.WriteLine(value: "\r\nPress any key to close the application...");
            Console.ReadLine();
        }

        private static async Task ConfigureRepositoryDefaults(ToolArguments arguments)
        {
            var repositoryConfiguration = ConfigurationProvider.Get(arguments.ConfigurationFilePath);
            var repositoryConfigurator = new DefaultRepositoryConfigurator(arguments.UserName, arguments.Password, arguments.Repository);
            await repositoryConfigurator.Configure(repositoryConfiguration);
        }

        private static async Task RunApplication(string[] args)
        {
            var toolArguments = new ToolArguments();

            var cmdLineParser = new CommandLineParser.CommandLineParser
            {
                ShowUsageHeader = "Here is how you use the repository provisioning app:",
                ShowUsageFooter = "For more information, see https://github.com/arcus-azure/arcus"
            };

            try
            {
                cmdLineParser.ExtractArgumentAttributes(toolArguments);
                cmdLineParser.ParseCommandLine(args);

                await ConfigureRepositoryDefaults(toolArguments);
            }
            catch (MandatoryArgumentNotSetException)
            {
                Console.ForegroundColor = AnnouncementColor;
                Console.WriteLine(value: "Failed to interpret your request. Here are the parsed commands.");
                cmdLineParser.ShowParsedArguments();

                Console.WriteLine(value: "Please make sure that you call the commands correctly.\r\n");
                ShowUsage(cmdLineParser);
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