/* -------------------------------------------------------------------------- */
/*                     OGC API – Connected Systems Index                      */
/* -------------------------------------------------------------------------- */

export * from './systems';
export * from './deployments';
export * from './procedures';
export * from './sampling-features';
export * from './properties';
export * from './datastreams';
export * from './observations';
export * from './controlstreams';
export * from './commands';
export * from './feasibility';
export * from './system-events';
export * from './helpers';
export * from './model';

/* -------------------------------------------------------------------------- */
/*                            Client Class Imports                            */
/* -------------------------------------------------------------------------- */

import { SystemsClient } from './systems';
import { DeploymentsClient } from './deployments';
import { ProceduresClient } from './procedures';
import { SamplingFeaturesClient } from './sampling-features';
import { PropertiesClient } from './properties';
import { DatastreamsClient } from './datastreams';
import { ObservationsClient } from './observations';
import { ControlStreamsClient } from './controlstreams';
import { CommandsClient } from './commands';
import { FeasibilityClient } from './feasibility';
import { SystemEventsClient } from './system-events';

/* -------------------------------------------------------------------------- */
/*                        Connected Systems Client Map                        */
/* -------------------------------------------------------------------------- */

/**
 * Aggregate mapping of all CSAPI client classes.
 * This allows unified imports such as:
 *   const client = new CSAPIClients.SystemsClient(apiRoot);
 */
export const CSAPIClients = {
  SystemsClient,
  DeploymentsClient,
  ProceduresClient,
  SamplingFeaturesClient,
  PropertiesClient,
  DatastreamsClient,
  ObservationsClient,
  ControlStreamsClient,
  CommandsClient,
  FeasibilityClient,
  SystemEventsClient,
};

/* -------------------------------------------------------------------------- */
/*                                End of File                                 */
/* -------------------------------------------------------------------------- */
