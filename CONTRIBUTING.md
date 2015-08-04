# Contributing to LAS Docs

Thanks for taking the time to contribute!

The following is a set of guidelines for contributing to LAS's Documentation. These are just guidelines, not rules, use your best judgment and feel free to propose changes to this document in a pull request.

## Submitting Issues

- You can create an issue [here](https://github.com/LeapAppServices/LAS-Docs/issues/new), but before doing that please read the notes below on submitting issues, and include as many details as possible with your report.
- Include the name of the platform where the issue is located. For example, the iOS Guide and the Android Docs would be under 'iOS' and 'Android', respectively.
- If you are reporting a discrepancy in what the documentation states against the actual behavior of the SDK, please make sure to explain the steps you've taken to reproduce the issue. A link to a bug report marked as valid or list of repro steps can help.
- Perform a [cursory search](https://github.com/issues?q=+is%3Aissue+user%3ALeapAppServices) to see if a similar issue has already been submitted.
- Please setup a [profile picture](https://help.github.com/articles/how-do-i-set-up-my-profile-picture) to make yourself recognizable and so we can all get to know each other.

## Pull Requests

- Use a [single commit per pull request](#creating-a-single-commit-per-pull-request).
- If your pull request adds a new code sample, it must include snippets in each of the supported languages. For example, always submit Swift and iOS samples when updating the iOS Guide.
- Follow the [Documentation Styleguide](#documentation-styleguide).
- End files with a newline.

### Creating a single commit per pull request

In order to keep the git commit history readable, we ask that you squash your commits down to a single commit before submitting a pull request.

You can use `git rebase`. To squash three commits into one, do the following:

    $ git rebase -i HEAD~3

Running this command gives you a list of commits in your text editor. Replace "pick" with "squash" next to the commits you want to squash into the commit before it. You will then be able to edit the message for the resulting commit.

If you've already pushed commits to GitHub, and then squashed them locally, you will have to force the push to your branch.

    $ git push origin branch-name --force

If you only want to modify your last commit message, it's very simple:

    $ git commit --amend

We provide several path-maps here, you can compile links of other pages with those paths:

    'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_DOCHOME': '',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS': '../devguide/ios.html',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_DATA_EN': '../devguide/ios.html#CloudData',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#ANALYTICS_EN': '../devguide/ios.html#Analytics',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_CONFIG_EN': '../devguide/ios.html#CloudConfig',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#MARKETING_EN': '../devguide/ios.html#Marketing',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#DEFINE_TARGETACTIVITY_EN': '',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SUPPORT_EN': '../devguide/ios.html#Support',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#USER_EN': '../devguide/ios.html#User',

        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID': '../devguide/android.html',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_DATA_EN': '../devguide/android.html#CloudData',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#ANALYTICS_EN': '../devguide/android.html#Analytics',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_CONFIG_EN': '../devguide/android.html#CloudConfig',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#MARKETING_EN': '../devguide/android.html#Marketing',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#DEFINE_TARGETACTIVITY_EN': '',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_EN': '../devguide/android.html#Support',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#USER_EN': '../devguide/android.html#User',

        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_DATA_ZH': '../devguide/ios.html#云数据',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_DATA_ZH': '../devguide/android.html#云数据',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#ANALYTICS_ZH': '../devguide/android.html#分析',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_CONFIG_ZH': '../devguide/android.html#云配置',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#MARKETING_ZH': '../devguide/android.html#营销',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#DEFINE_TARGETACTIVITY_ZH': '',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_ZH': '../devguide/android.html#支持',
        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#USER_ZH': '../devguide/android.html#用户',

        'LAS_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA': '../devguide/java.html',
        'LAS_DOCS_LINK_PLACEHOLDER_SDK_TUTORIALS_IOS': '../../tutorials/ios.html',
        'LAS_DOCS_LINK_PLACEHOLDER_SDK_TUTORIALS_ANDROID': '../../tutorials/android.html',
        'LAS_DOCS_LINK_PLACEHOLDER_USERMANUAL': '../usermanual',
        'LAS_DOCS_LINK_PLACEHOLDER_USERMANUAL/#USERMGMT_SEGMENT_ZH': '',
        'LAS_DOCS__LINK_PLACEHOLDER_USERMANUAL/#USERMGMT_SEGMENT_EN': ''
        
    For example, if you want to insert /devguide/ios.htm#Marketing in a file,it can be written as LAS_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#Marketing

### See also:
[Git Book Chapter 7.6: Git Tools - Rewriting History](http://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Limit the first line to 72 characters or less
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Reference issues and pull requests liberally

## Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown). The parser uses [marked](https://github.com/chjj/marked)'s lexer.
