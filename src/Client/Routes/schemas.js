'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

// Dashboard
Router.route('/schemas/', function() {
    if(currentUserHasScope('schemas')) {
        ViewHelper.get('NavbarMain').showTab('/schemas/');
        
        populateWorkspace(
            _.div({class: 'dashboard-container'},
                _.h1('Schemas'),
                _.p('Please click on a schema to proceed')
            ),
            'presentation presentation-center'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Router.route('/schemas/:id', function() {
    if(currentUserHasScope('schemas')) {
        let schemaEditor = new HashBrown.Views.Editors.SchemaEditor({
            modelUrl: RequestHelper.environmentUrl('schemas/' + this.id)
        });
        
        ViewHelper.get('NavbarMain').highlightItem('/schemas/', this.id);
        
        populateWorkspace(schemaEditor.$element);
    
    } else {
        location.hash = '/';

    }
});

// Edit (JSON editor)
Router.route('/schemas/json/:id', function() {
    if(currentUserHasScope('schemas')) {
        let jsonEditor = new HashBrown.Views.Editors.JSONEditor({
            model: resources.schemas[this.id],
            apiPath: 'schemas/' + this.id,
            onSuccess: () => {
                return RequestHelper.reloadResource('schemas')
                .then(() => {
                    let navbar = ViewHelper.get('NavbarMain');
                    
                    navbar.reload();
                });
            }
        });

        ViewHelper.get('NavbarMain').highlightItem('/schemas/', this.id);
        
        populateWorkspace(jsonEditor.$element);
    
    } else {
        location.hash = '/';

    }
});
