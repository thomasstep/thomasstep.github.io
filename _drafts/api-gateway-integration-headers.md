i had this problem with s3 integration where i needed the s3's content-type to be passed through. need to create a mapping in the method response and then fill in the value in the integration response.
integration response is where the value is filled and in the method response we can filter those values including allowing them. the method response and the integration response need to line up in order for the headers to get through.
values in the integration response can be from the integration's actual response, stage variables, static values, or others.
