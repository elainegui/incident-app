package ie.incidentapp.entities;

import javax.persistence.*;

@Entity
public class IncidentType {

    @Id
    private int id;
    private String description;

    public int getId() {
        return id;
    }

    public IncidentType() {    }

    public IncidentType(int id, String description) {
        this.id = id;
        this.description = description;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
