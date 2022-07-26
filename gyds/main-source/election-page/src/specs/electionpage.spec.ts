import { ElectionPageService, getElectionPages } from '../services';
import {ElectionPageModel } from '../models/ElectionPageModel';

describe('***********Unit Tests for servicedata/list***********', () => {
    let executionSpy, serviceSpy;
    let electionpageService: ElectionPageModel;

        var homepagedata1  = new ElectionPageModel(1,'Sample Data 1') ;
        var homepagedata2  = new ElectionPageModel(2,'Sample Data 2') ;
        var homepagedata3  = new ElectionPageModel(2,'Sample Data 3') ;

        var homepages:ElectionPageModel[]; 
        homepages = [homepagedata1 , homepagedata2 , homepagedata3] 

    beforeEach(() => {
        serviceSpy = {
            scan: jasmine.createSpy('scan'),
        };
        executionSpy = {
            exec: jasmine.createSpy('exec')
        };
        serviceSpy.scan.and.callFake(() => executionSpy);
        electionpageService = new ElectionPageService();
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
                getElectionPages(electionpageService, (error, resultData) => {
                    result = resultData;
                });
                expect(result[0].homepageData).toBe('Sample Data 1');

                
            });
        });
    });
});
