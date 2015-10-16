# Contributing to Lep Cloud Docs

Thanks for taking the time to contribute!

The following is a set of guidelines for contributing to Lep Cloud's Documentation. These are just guidelines, not rules, use your best judgment and feel free to propose changes to this document in a pull request.

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

        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_DOCHOME': '/guide/docs.html',

        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS': '/guide/devguide/ios.html',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_DATA_EN': '/guide/devguide/ios.html#cloud-data',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#ANALYTICS_EN': '/guide/devguide/ios.html#analytics',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_CONFIG_EN': '/guide/devguide/ios.html#cloud-config',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#MARKETING_EN': '/guide/devguide/ios.html#marketing',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SUPPORT_EN': '/guide/devguide/ios.html#support',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#USER_EN': '/guide/devguide/ios.html#user',

        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_DATA_ZH': '/guide/devguide/ios.html#云数据',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#ANALYTICS_ZH': '/guide/devguide/ios.html#分析',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#MARKETING_ZH': '/guide/devguide/ios.html#营销',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SUPPORT_ZH': '/guide/devguide/ios.html#支持',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_CONFIG_ZH': '/guide/devguide/ios.html#云配置',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#USER_ZH': '/guide/devguide/ios.html#用户',

        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID': '/guide/devguide/android.html',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_DATA_EN': '/guide/devguide/android.html#cloud-data',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#ANALYTICS_EN': '/guide/devguide/android.html#analytics',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_CONFIG_EN': '/guide/devguide/android.html#cloud-config',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#MARKETING_EN': '/guide/devguide/android.html#marketing',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_EN': '/guide/devguide/android.html#support',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#USER_EN': '/guide/devguide/android.html#user',

        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_DATA_ZH': '/guide/devguide/android.html#云数据',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#ANALYTICS_ZH': '/guide/devguide/android.html#分析',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#CLOUD_CONFIG_ZH': '/guide/devguide/android.html#云配置',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#MARKETING_ZH': '/guide/devguide/android.html#营销',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_ZH': '/guide/devguide/android.html#支持',
        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#USER_ZH': '/guide/devguide/android.html#用户',

        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_JAVA': '/guide/devguide/java.html',

        'ML_DOCS_GUIDE_LINK_PLACEHOLDER_PYTHON': '/guide/devguide/python.html',

        'ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#MARKETING': '/guide/usermanual/marketing.html',
        'ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#USERMGMT_SEGMENT_EN': '/guide/usermanual/usermgmt.html',
        'ML_DOCS_LINK_PLACEHOLDER_USERMANUAL#USERMGMT_SEGMENT_ZH': '/guide/usermanual/usermgmt.html',


        'ML_DOCS_LINK_PLACEHOLDER_SDK_TUTORIALS_IOS': '/tutorials/ios.html',
        'ML_DOCS_LINK_PLACEHOLDER_SDK_TUTORIALS_ANDROID': '/tutorials/android.html',
        'ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS': '/quickstart/ios/core/existing.html',
        'ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID': '/quickstart/android/core/existing.html',
        'ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_JAVA': '/quickstart/java/core/existing.html',
        'ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS': '/api/ios/index.html',
        'ML_DOCS_LINK_PLACEHOLDER_API_REF_ANDROID': '/api/android/index.html'

    For example, if you want to insert /devguide/ios.htm#Marketing in a file,it can be written as ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#Marketing

### See also:
[Git Book Chapter 7.6: Git Tools - Rewriting History](http://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Limit the first line to 72 characters or less
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Reference issues and pull requests liberally

## Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown). The parser uses [marked](https://github.com/chjj/marked)'s lexer.
