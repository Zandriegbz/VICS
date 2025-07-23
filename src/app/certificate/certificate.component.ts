import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitorService } from '../services/visitor.service';
import { Visitor } from '../models/visitor.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit, OnDestroy {
  visitor: Visitor | undefined;
  currentDate: Date = new Date();
  private routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private visitorService: VisitorService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.visitorService.getVisitor(id).subscribe(visitor => {
          this.visitor = visitor;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
