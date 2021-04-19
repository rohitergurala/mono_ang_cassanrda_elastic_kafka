import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MonoAngCassElasticKafkaTestModule } from '../../../test.module';
import { UserManagementComponent } from 'app/admin/user-management/user-management.component';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.model';

describe('Component Tests', () => {
  describe('User Management Component', () => {
    let comp: UserManagementComponent;
    let fixture: ComponentFixture<UserManagementComponent>;
    let service: UserService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MonoAngCassElasticKafkaTestModule],
        declarations: [UserManagementComponent],
      })
        .overrideTemplate(UserManagementComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UserManagementComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserService);
    });

    describe('OnInit', () => {
      it('Should call load all on init', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const headers = new HttpHeaders().append('link', 'link;link');
          spyOn(service, 'query').and.returnValue(
            of(
              new HttpResponse({
                body: [new User('9fec3727-3421-4967-b213-ba36557ca194')],
                headers,
              })
            )
          );

          // WHEN
          comp.ngOnInit();
          tick(); // simulate async

          // THEN
          expect(service.query).toHaveBeenCalled();
          expect(comp.users && comp.users[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
        })
      ));
    });

    describe('setActive', () => {
      it('Should update user and call load all', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const headers = new HttpHeaders().append('link', 'link;link');
          const user = new User('9fec3727-3421-4967-b213-ba36557ca194');
          spyOn(service, 'query').and.returnValue(
            of(
              new HttpResponse({
                body: [user],
                headers,
              })
            )
          );
          spyOn(service, 'update').and.returnValue(of(new HttpResponse({ status: 200 })));

          // WHEN
          comp.setActive(user, true);
          tick(); // simulate async

          // THEN
          expect(service.update).toHaveBeenCalledWith({ ...user, activated: true });
          expect(service.query).toHaveBeenCalled();
          expect(comp.users && comp.users[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
        })
      ));
    });
  });
});
