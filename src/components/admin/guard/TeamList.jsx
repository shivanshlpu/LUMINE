import React from 'react';

const TeamList = ({ teams, selectedTeamId, onSelectTeam, onAddTeam }) => {

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'var(--status-active)';
            case 'Busy': return 'var(--status-busy)';
            case 'Free': return 'var(--status-free)';
            case 'Rest': return 'var(--status-rest)';
            default: return 'var(--status-offline)';
        }
    };

    return (
        <div className="col-left" id="team-list-container">
            <div className="section-title">
                <span>All Teams</span>
                <span className="badge" style={{ background: 'var(--gray-200)', color: 'var(--navy)' }}>Total: {teams.length}</span>
            </div>

            {teams.map(team => (
                <div
                    key={team.id}
                    className={`team-card ${team.id === selectedTeamId ? 'selected' : ''}`}
                    onClick={() => onSelectTeam(team.id)}
                >
                    <div className="card-header">
                        <span className="team-name">{team.name}</span>
                        <span className="status-badge" style={{ background: getStatusColor(team.status) }}>{team.status}</span>
                    </div>
                    <div className="card-meta">
                        <span><i className="fas fa-clock"></i> {team.lastUpdate}</span>
                        <span><i className="fas fa-tasks"></i> {team.tasksToday}/{team.tasksTotal}</span>
                    </div>
                    <div className="card-loc">
                        <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i>
                        {team.status === 'Offline' ? 'Last known loc' : 'Live Tracking'}
                    </div>
                </div>
            ))}

            <button className="btn-add-team" onClick={onAddTeam}>
                <i className="fas fa-plus"></i> Add New Team
            </button>
        </div>
    );
};

export default TeamList;
