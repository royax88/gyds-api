import {HomePageService } from '../services/manageconfig.service';
import {HomePageModel } from '../models/HomePageModel';

describe('***********Unit Tests for Service Data Service***********', () => {
    let service: HomePageService;
  
   
        var homepagedata1 = new HomePageModel(1,'Sample Data 1') ;
        var homepagedata2 = new HomePageModel(2,'Sample Data 2') ;
        var homepagedata3 = new HomePageModel(2,'Sample Data 3') ;

        var mockdata:HomePageModel[]; 
        mockdata = [homepagedata1 , homepagedata2 , homepagedata3] 


    describe('HomePageService Tests', () => {
        beforeEach(() => {
       
            service = new HomePageService();
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
