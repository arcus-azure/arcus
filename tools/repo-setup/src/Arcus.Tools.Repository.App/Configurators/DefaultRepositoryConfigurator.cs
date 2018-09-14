using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Arcus.Tools.Repository.App.GitHub;
using Arcus.Tools.Repository.App.Model;
using Arcus.Tools.Repository.App.Yaml;
using GuardNet;

namespace Arcus.Tools.Repository.App.Configurators
{
    public class DefaultRepositoryConfigurator
    {
        private readonly GitHubRepository githubRepository;

        public DefaultRepositoryConfigurator(string username, string password, string repository)
        {
            Guard.NotNullOrEmpty(username, nameof(username));
            Guard.NotNullOrEmpty(password, nameof(password));
            Guard.NotNullOrEmpty(repository, nameof(repository));

            Repository = repository;

            githubRepository = new GitHubRepository(username, password);
        }

        public string Repository { get; }

        public async Task Configure(RepositoryConfiguration repositoryConfiguration)
        {
            var githubRepo = await githubRepository.GetRepository(Repository);

            Console.WriteLine($"Starting with default configuration for repository {Repository}");

            await CreateLabels(repositoryConfiguration.Labels, githubRepo);
            await CreateMilestones(repositoryConfiguration.Milestones, githubRepo);
            await CreateIssues(repositoryConfiguration.Issues, githubRepo);

            Console.WriteLine($"Finished configuring repository {Repository}");
        }

        private async Task CreateIssues(List<Issue> issues, Octokit.Repository githubRepo)
        {
            foreach (var issue in issues)
            {
                await githubRepository.CreateIssueIfNotExists(issue, githubRepo);
            }
        }

        private async Task CreateMilestones(List<Milestone> milestones, Octokit.Repository githubRepo)
        {
            foreach (var milestone in milestones)
            {
                await githubRepository.CreateMilestoneIfNotExists(milestone, githubRepo);
            }
        }

        private async Task CreateLabels(List<Label> labels, Octokit.Repository githubRepo)
        {
            foreach (var label in labels)
            {
                await githubRepository.CreateLabelIfNotExists(label, githubRepo);
            }
        }
    }
}