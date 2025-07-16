import { Component } from '@angular/core';

@Component({
    selector: 'app-credits',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.css'],
    standalone: false
})
export class CreditsComponent {
  frontendTeam = [
    { name: 'ETHEL DAWN T. PENASO', role: 'Frontend Developer', avatarUrl: 'assets/credits-avatars/ethel_avatar.jpg' },
    { name: 'AZALEA ROSZIEL I. LENIHAN', role: 'Frontend Developer', avatarUrl: 'assets/credits-avatars/azalea_avatar.jpg' },
    { name: 'SANDRIE JAY R. GABRIEL', role: 'Frontend Developer', avatarUrl: 'assets/credits-avatars/sandrie_avatar.jpg' },
    { name: 'RAYMOND G. CASCAÑO', role: 'Frontend Developer', avatarUrl: 'assets/credits-avatars/raymond_avatar.jpg' },
    { name: 'JUVANIE N. LEPROSO', role: 'Frontend Developer', avatarUrl: 'assets/credits-avatars/juvanie_avatar.jpg' },
    { name: 'CHRIS ALDEN P. CARREON', role: 'Frontend Developer', avatarUrl: 'assets/credits-avatars/chris_avatar.jpg' }
  ];

  backendTeam = [
    { name: 'Darwey Roie Sanchez', role: 'Backend Developer', avatarUrl: 'assets/organization-logos/hris_logo.png' },
    { name: 'Rogel Alangilan', role: 'Database Administrator', avatarUrl: 'assets/organization-logos/hris_logo.png' },
    { name: 'Firstname Surname', role: 'System Architect', avatarUrl: 'assets/organization-logos/hris_logo.png' },
    { name: 'Firstname Surname', role: 'API Developer', avatarUrl: 'assets/organization-logos/hris_logo.png' }
  ];

  organizations = [
    { name: 'Provincial Government of Davao Del Norte', role: 'Project Sponsor', avatarUrl: 'assets/organization-logos/davnor_logo.png' },
    { name: 'UM Tagum College', role: 'Academic Partner', avatarUrl: 'assets/organization-logos/umtc_logo.png' },
    { name: 'Human Resource Information System', role: 'Key User/Collaborator', avatarUrl: 'assets/organization-logos/hris_logo.png' }
  ];
}
