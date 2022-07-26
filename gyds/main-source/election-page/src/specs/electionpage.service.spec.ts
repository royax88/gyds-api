import {ElectionPageService } from '../services/electionpage.service';
import {ElectionPageModel } from '../models/ElectionPageModel';

describe('***********Unit Tests for Service Data Service***********', () => {
    let service: ElectionPageService;
  
   
        var homepagedata1 = new ElectionPageModel(1,'Sample Data 1') ;
        var homepagedata2 = new ElectionPageModel(2,'Sample Data 2') ;
        var homepagedata3 = new ElectionPageModel(2,'Sample Data 3') ;

        var mockdata:ElectionPageModel[]; 
        mockdata = [homepagedata1 , homepagedata2 , homepagedata3] 


    describe('HomePageService Tests', () => {
        beforeEach(() => {
       
            service = new ElectionPageService();
        });

        describe('When contents are listed', () => {
         
            it('should return the list of contents', () => {
                let result;
                service.list().subscribe(homepageData => result = homepageData);
               
                expect(result).toEqual(mockdata);
            });
        });

    });

  
   
});
