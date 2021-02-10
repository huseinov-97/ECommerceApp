package com.huseinov.ecommerce.config;

import com.huseinov.ecommerce.entity.Product;
import com.huseinov.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        HttpMethod[] theUnsoppertedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        // disable http methods for Products: PUT, POST, DELETE
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsoppertedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsoppertedActions));

        //disable http methods for ProductCategory
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsoppertedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsoppertedActions));

        // call an internal helper method
        exposeIds(config);

    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // expose entity Ids

        //get a list of all entity classes from the entityManager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // create an array of entity types
        List<Class> entityClasses = new ArrayList<>();

        //get the entity types dor the entities
         for (EntityType tempEntityType: entities){
             entityClasses.add(tempEntityType.getJavaType());
         }

         // expose the entity ids for the array od entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
         config.exposeIdsFor(domainTypes);

        

    }
}
