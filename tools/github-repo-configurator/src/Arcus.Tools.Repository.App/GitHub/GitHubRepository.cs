using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GuardNet;
using Octokit;
using Issue = Arcus.Tools.Repository.App.Model.Issue;
using Label = Arcus.Tools.Repository.App.Model.Label;

namespace Arcus.Tools.Repository.App.GitHub
{
    public class GitHubRepository
    {
        public GitHubRepository(string username, string password)
        {
            Guard.NotNullOrEmpty(username, nameof(username));
            Guard.NotNullOrEmpty(password, nameof(password));

            Username = username;
            Password = password;

            var basicAuth = new Credentials(username, password, AuthenticationType.Basic);
            GitHubClient.Credentials = basicAuth;
        }

        public string Password { get; }
        public string Username { get; }
        protected GitHubClient GitHubClient { get; } = new GitHubClient(new ProductHeaderValue(name: "arcus-automation-app"));

        public async Task CreateIssue(Issue issue, Octokit.Repository githubRepo, Milestone relatedMilestone)
        {
            var optimizedDescription = issue.Description.Replace("- [ ]", "\r\n- [ ]");

            var newIssue = new NewIssue(issue.Title)
            {
                Body = optimizedDescription,
                Milestone = relatedMilestone.Number
            };

            foreach (var label in issue.Labels)
            {
                newIssue.Labels.Add(label);
            }

            var createdIssue = await GitHubClient.Issue.Create(githubRepo.Id, newIssue);
            Log($"Issue '{createdIssue.Title}' created (#{createdIssue.Number})");
        }

        public async Task CreateIssueIfNotExists(Issue issue, Octokit.Repository githubRepo)
        {
            var foundIssue = await GetIssue(issue.Title, githubRepo);
            if (foundIssue != null)
            {
                Log($"Issue '{foundIssue.Title}' already exists (#{foundIssue.Id})");
                return;
            }

            var relatedMilestone = await GetMilestone(issue.MilestoneName, githubRepo);
            if (relatedMilestone == null)
            {
                throw new Exception($"Milestone '{issue.MilestoneName}' was not found");
            }

            await CreateIssue(issue, githubRepo, relatedMilestone);
        }

        public async Task CreateLabel(Label label, Octokit.Repository githubRepo)
        {
            var newLabel = new NewLabel(label.Name, label.Color)
            {
                Description = label.Description
            };

            var createdLabel = await GitHubClient.Issue.Labels.Create(githubRepo.Id, newLabel);
            Log($"Label '{createdLabel.Name}' created");
        }

        public async Task CreateLabelIfNotExists(Label label, Octokit.Repository githubRepo)
        {
            try
            {
                await GetLabel(label.Name, githubRepo);
                Log($"Label '{label.Name}' already exists");
            }
            catch (NotFoundException)
            {
                await CreateLabel(label, githubRepo);
            }
        }

        public async Task CreateMilestone(Model.Milestone milestone, Octokit.Repository githubRepo)
        {
            var newMilestone = new NewMilestone(milestone.Title)
            {
                Description = milestone.Description
            };

            var createdMilestone = await GitHubClient.Issue.Milestone.Create(githubRepo.Id, newMilestone);
            Log($"Milestone '{createdMilestone.Title}' created (Number: {createdMilestone.Number})");
        }

        public async Task CreateMilestoneIfNotExists(Model.Milestone milestone, Octokit.Repository githubRepo)
        {
            var foundMilestone = await GetMilestone(milestone.Title, githubRepo);
            if (foundMilestone != null)
            {
                Log($"Milestone '{foundMilestone.Title}' already exists (Number: {foundMilestone.Number})");
                return;
            }

            await CreateMilestone(milestone, githubRepo);
        }

        public async Task<Octokit.Issue> GetIssue(string title, Octokit.Repository githubRepo)
        {
            IReadOnlyList<Octokit.Issue> allIssues = await GitHubClient.Issue.GetAllForRepository(githubRepo.Id);
            var foundIssue = allIssues.SingleOrDefault(i => i.Title.Equals(title, StringComparison.InvariantCultureIgnoreCase));
            return foundIssue;
        }

        public async Task GetLabel(string name, Octokit.Repository githubRepo)
        {
            await GitHubClient.Issue.Labels.Get(githubRepo.Id, name);
        }

        public async Task<Octokit.Repository> GetRepository(string repositoryName)
        {
            IReadOnlyList<Octokit.Repository> allRepositories = await GitHubClient.Repository.GetAllForCurrent();
            var foundRepository = allRepositories.FirstOrDefault(repo => repo.FullName.Equals(repositoryName, StringComparison.InvariantCultureIgnoreCase));
            if (foundRepository == null)
            {
                throw new Exception("Repository '{repositoryName}' was not found. Make sure you are a collaborator on the repository");
            }

            return foundRepository;
        }

        private static void Log(string message)
        {
            Console.WriteLine($"  > {message}");
        }

        private async Task<IReadOnlyList<Milestone>> GetAllMilestones(Octokit.Repository githubRepo)
        {
            return await GitHubClient.Issue.Milestone.GetAllForRepository(githubRepo.Id);
        }

        private async Task<Milestone> GetMilestone(string milestoneName, Octokit.Repository githubRepo)
        {
            IReadOnlyList<Milestone> milestones = await GetAllMilestones(githubRepo);
            var relatedMilestone = milestones.SingleOrDefault(m => m.Title.Equals(milestoneName, StringComparison.InvariantCultureIgnoreCase));
            return relatedMilestone;
        }
    }
}