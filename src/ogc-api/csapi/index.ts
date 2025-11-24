/**
 * @license BSD-3-Clause
 * Copyright (c) 2024 OS4CSAPI contributors
 */

/* -------------------------------------------------------------------------- */
/*                     OGC API – Connected Systems Index                      */
/* -------------------------------------------------------------------------- */

export * from './systems';
export * from './deployments';
export * from './procedures';
export * from './samplingFeatures';
export * from './properties';
export * from './datastreams';
export * from './observations';
export * from './controlStreams';
export * from './commands';
export * from './feasibility';
export * from './systemEvents';
export * from './helpers';
export * from './model';

/* -------------------------------------------------------------------------- */
/*                            Client Class Imports                            */
/* -------------------------------------------------------------------------- */

import { SystemsClient } from './systems';
import { DeploymentsClient } from './deployments';
import { ProceduresClient } from './procedures';
import { SamplingFeaturesClient } from './samplingFeatures';
import { PropertiesClient } from './properties';
import { DatastreamsClient } from './datastreams';
import { ObservationsClient } from './observations';
import { ControlStreamsClient } from './controlStreams';
import { CommandsClient } from './commands';
import { FeasibilityClient } from './feasibility';
import { SystemEventsClient } from './systemEvents';

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
