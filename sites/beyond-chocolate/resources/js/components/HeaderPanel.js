import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from './auth-context';
import { useLocale } from '../lib/locale-context';
import { uiText } from '../static/ui-text';

const HeaderPanel = () => {
    const { user, logout } = useAuth();
    const { locale, update } = useLocale();
    const [showNoAssignmentsPanel, setShowNoAssignmentsPanel] = useState(true);
    const noAssignments =
        user?.questionnaires?.length === 0 && user?.permissions.indexOf('manage-surveys') === -1;

    let text = uiText[locale.active];

    const handleClose = () => setShowNoAssignmentsPanel(false);

    const panel = (
        <Card>
            <Card.Body>
                {text.textAssignmentPanel}
                <span className="ml-2">
                    <Button
                        variant="secondary"
                        type="button"
                        aria-label="Close"
                        onClick={handleClose}
                    >
                        {text.btnOk}
                    </Button>
                </span>
            </Card.Body>
        </Card>
    );
    return noAssignments && showNoAssignmentsPanel && panel;
};

export default HeaderPanel;
