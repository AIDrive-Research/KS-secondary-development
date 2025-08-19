
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class AlertMsg {
    private String id;
    @JsonProperty("alert_time")
    private Double alertTime;
    private Object device;
    private Object source;
    private Object alg;
    private String image;
    @JsonProperty("reserved_data")
    private Object reservedData;
    @JsonProperty("hazard_leve")
    private String hazardLeve;
}
