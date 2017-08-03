'use strict';

const TemplateEditor = require('Client/Views/Editors/TemplateEditor');
const RequestHelper = require('Client/Helpers/RequestHelper');

// Templates
Router.route('/templates/', function() {
    if(currentUserHasScope('templates')) {
        ViewHelper.get('NavbarMain').showTab('/templates/');

        populateWorkspace(
            _.div({class: 'dashboard-container'},
                _.h1('Templates'),
                _.p('Please click on a template to continue')
            ),
            'presentation presentation-center'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Router.route('/templates/:type/:id', function() {
    if(currentUserHasScope('templates')) {
        ViewHelper.get('NavbarMain').highlightItem('/templates/', this.type + '/' + this.id);
        
        let templateEditor = new TemplateEditor({
            modelUrl: RequestHelper.environmentUrl('templates/' + this.type + '/' + this.id)
        });

        populateWorkspace(templateEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
