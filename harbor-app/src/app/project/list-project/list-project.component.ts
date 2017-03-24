import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Project } from '../project';
import { ProjectService } from '../project.service';

import { SessionService } from '../../shared/session.service';
import { SearchTriggerService } from '../../base/global-search/search-trigger.service';
import { ListMode, ProjectTypes, RoleInfo } from '../../shared/shared.const';

import { State } from 'clarity-angular';

@Component({
  moduleId: module.id,
  selector: 'list-project',
  templateUrl: 'list-project.component.html',
  styleUrls: ['./list-project.component.css']
})
export class ListProjectComponent implements OnInit {

  @Input() projects: Project[];


  @Input() totalPage: number;
  @Input() totalRecordCount: number;
  pageOffset: number = 1;

  @Input() filteredType: string;

  @Output() paginate = new EventEmitter<State>();

  @Output() toggle = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  @Input() mode: string = ListMode.FULL;

  roleInfo = RoleInfo;

  constructor(
    private session: SessionService,
    private router: Router,
    private searchTrigger: SearchTriggerService) { }

  ngOnInit(): void {
  }

  public get listFullMode(): boolean {
    return this.mode === ListMode.FULL && this.session.getCurrentUser() != null;
  }

  get showRoleInfo(): boolean {
    return this.listFullMode && this.filteredType === ProjectTypes[0];
  }

  public get isSystemAdmin(): boolean {
    let account = this.session.getCurrentUser();
    return account != null && account.has_admin_role > 0;
  }

  goToLink(proId: number): void {
    this.searchTrigger.closeSearch(true);

    let linkUrl = ['harbor', 'projects', proId, 'repository'];
    if (!this.session.getCurrentUser()) {
      let navigatorExtra: NavigationExtras = {
        queryParams: { "guest": true }
      };

      this.router.navigate(linkUrl, navigatorExtra);
    } else {
      this.router.navigate(linkUrl);

    }
  }

  refresh(state: State) {
    this.paginate.emit(state);
  }

  newReplicationRule(p: Project) {
    if(p) {
      this.router.navigateByUrl(`/harbor/projects/${p.project_id}/replication?is_create=true`);
    }
  }

  toggleProject(p: Project) {
    this.toggle.emit(p);
  }

  deleteProject(p: Project) {
    this.delete.emit(p);
  }

}