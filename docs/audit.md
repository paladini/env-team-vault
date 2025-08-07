# Audit Events in Env Team Vault

Env Team Vault automatically records audit events for all critical actions performed by users and the system. These logs provide transparency, accountability, and traceability for your team's environment management.

## List of Audit Events

| Event                | Description                                                      |
|----------------------|------------------------------------------------------------------|
| USER_REGISTERED      | A new user registered an account                                 |
| USER_LOGIN           | A user logged in to the system                                   |
| TEAM_CREATED         | A new team was created                                           |
| TEAM_UPDATED         | A team was updated                                               |
| TEAM_DELETED         | A team was deleted                                               |
| APPLICATION_CREATED  | A new application was created                                    |
| APPLICATION_UPDATED  | An application was updated                                       |
| APPLICATION_DELETED  | An application was deleted                                       |
| VARIABLE_CREATED     | An environment variable was created                              |
| VARIABLE_UPDATED     | An environment variable was updated                              |
| VARIABLE_DELETED     | An environment variable was deleted                              |
| SYNC_ENV             | Environment variables were synced via CLI/API                    |

## What is Logged?
- **Action**: The type of event (see above)
- **Target Type**: The entity affected (User, Team, Application, Variable)
- **Target ID**: The unique identifier of the affected entity
- **User ID**: The user who performed the action
- **Timestamp**: When the event occurred

## How to View Audit Logs
Audit logs are stored in the database and can be accessed via the admin interface or directly via the database for compliance and troubleshooting.

## Why Audit?
- Security and compliance
- Team accountability
- Troubleshooting and history

---
For more details, see the [README](../README.md) or contact your system administrator.
