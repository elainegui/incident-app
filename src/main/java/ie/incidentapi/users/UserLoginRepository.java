package ie.incidentapi.users;

import org.springframework.data.repository.CrudRepository;

public interface UserLoginRepository extends CrudRepository<UserLogin, String> {
	
	

}