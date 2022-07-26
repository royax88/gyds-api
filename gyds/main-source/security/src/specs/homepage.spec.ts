import { HomePageService, getHomePages } from '../services';
import {HomePageModel } from '../models/SecurityModel';

describe('***********Unit Tests for servicedata/list***********', () => {
    let executionSpy, serviceSpy;
    let homepageService: HomePageService;

        var homepagedata1  = new HomePageModel(1,'Sample Data 1') ;
        var homepagedata2  = new HomePageModel(2,'Sample Data 2') ;
        var homepagedata3  = new HomePageModel(2,'Sample Data 3') ;

        var homepages:HomePageModel[]; 
        homepages = [homepagedata1 , homepagedata2 , homepagedata3] 

    beforeEach(() => {
        serviceSpy = {
            scan: jasmine.createSpy('scan'),
        };
        executionSpy = {
            exec: jasmine.createSpy('exec')
        };
        serviceSpy.scan.and.callFake(() => executionSpy);
        homepageService = new HomePageService();
    });

    describe('List Data', () => {
        beforeEach(() => {
            executionSpy.exec.and.callFake((callback) => {
                callback(null, homepages);
            });
        });

        describe('When list service data is successfull', () => {
            it('Verify getContents was called successfully', () => {
                let result;
                getHomePages(homepageService, (error, resultData) => {
                    result = resultData;
                });
                expect(result[0].homepageData).toBe('Sample Data 1');

                
            });
        });
    });
});
