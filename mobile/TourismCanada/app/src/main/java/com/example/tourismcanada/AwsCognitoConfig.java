package com.example.tourismcanada;

import android.content.Context;

import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUserPool;
import com.amazonaws.regions.Regions;

public class AwsCognitoConfig {

    private Context context;
    private String PoolId = "ca-central-1_2p1uEs5u0";
    private String ClientId = "uf76kfbsfg2494t04ah5nuq95";
    private String clientSecret;
    private Regions Region = Regions.CA_CENTRAL_1;

    public AwsCognitoConfig(Context context){
        this.context=context;
    }
    public String getPoolId(){
        return PoolId;
    }

    public String getClientId(){
        return ClientId;
    }

    public Regions getRegion(){
        return Region;
    }

    public String getClientSecret(){
        return clientSecret;
    }

    public CognitoUserPool getPool(){
        return new CognitoUserPool(context, PoolId, ClientId,clientSecret, Region);
    }
}
