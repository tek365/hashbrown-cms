'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--environment">
        ${require('./inc/spinner')(_, view)}
        
        <main class="page--environment__spaces">
            <div class="page--environment__space page--environment__space--menu"></div>
            <div class="page--environment__space page--environment__space--nav"></div>
            <div class="page--environment__space page--environment__space--editor"></div>
        </main>

        ${require('./inc/scripts')(_, view)}
            
        <script>
            window.HashBrown = {};
            HashBrown.Context = {
                projectName: '${view.currentProjectName}',
                projectId: '${view.currentProject}',
                projectSettings: ${JSON.stringify(view.currentProjectSettings)},
                environment: '${view.currentEnvironment}',
                user: ${JSON.stringify(view.user)},
                isMediaPicker: ${view.isMediaPicker},
                themes: ${JSON.stringify(view.themes)}
            };
        </script>

        <script src="/js/common.js"></script>
        <script src="/js/service.js"></script>
        <script src="/js/entity.js"></script>
        <script src="/js/utilities.js"></script>
        
        <script src="/js/environment.js"></script>
        <script src="/js/plugins.js"></script>
    </body>
</html>

`
